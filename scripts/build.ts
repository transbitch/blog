const { marked } = require('marked');
const fs = require('fs-extra');
const _handlebars = require('handlebars');

const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const handlebars = allowInsecurePrototypeAccess(_handlebars);


type Page = PageLit & typeof PageProto;

type PageLit = {
    date: string | null;
    title: string;
    contentMd: string;
    previous?: Page;
    next?: Page;
}

const PageProto = {
    get href() {
        return `/${this.date}/${yassify(this.title)}/`;
    },
    
    get diskPath() {
        return `docs${this.href}index.html`;
    }
}

// im a bit whimsical
const Page = (lit: PageLit) => {
    const page = Object.create(PageProto);
    Object.assign(page, lit);
    return page;
}

const yassify = (text: string) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w]/g, '-')
        .replace(/-+/, '-')
        .replace(/^-/, '')
        .replace(/-$/, '');
}

(async () => {
    await fs.emptyDir('docs');
    fs.copy('static', 'docs');

    const base = handlebars.compile(await fs.readFile('templates/base.html', 'utf-8'));
    const nav = handlebars.compile(await fs.readFile('templates/nav.html', 'utf-8'));

    const files = await fs.readdir('src', { recursive: true, withFileTypes: true });

    const pages: Page[] = await Promise.all(files.map(async file => {
        if (!file.isFile()) {
            return;
        }

        const path = file.parentPath + '/' + file.name;
        console.log(path);
        const contentMd = await fs.readFile(path, 'utf-8');

        const [date, title] = file.name.match(/(\d{4}-\d{2}-\d{2}) (.*)\.md/)?.slice(1) ?? [null, file.name.split('.')[0]];

        return Page({
            date,
            title,
            contentMd
        });
    }));

    pages.sort((a: Page, b: Page) => a.date && b.date ? a.date.localeCompare(b.date, 'en') : 0);
    for (let i = 0; i < pages.length - 1; i++) {
        pages[i].next = pages[i + 1];
        pages[i + 1].previous = pages[i];
    }

    await Promise.all(pages.map(async (page) => {
        console.log('Path '+page.diskPath);
        const navHtml = nav({ page });
        const contentHtml = marked(page.contentMd);
        const pageHtml = base({ title: page.title, content: contentHtml, nav: navHtml });
        await fs.outputFile(page.diskPath, pageHtml);
    }));

    fs.copy(pages.at(-1)?.diskPath, 'docs/index.html')

    console.log('Slay qxeen we done!');
})();
