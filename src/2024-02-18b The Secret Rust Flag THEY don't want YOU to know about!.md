Have you ever wanted to use unstable `#![feature(...)]` features on a stable Rust compiler, out of perhaps sheer laziness of not wanting to change your toolchain to nightly? Fret no more! For there is a ***super secret*** `rustc` flag that they don’t want you to know about!

Drumroll please… it’s `RUSTC_BOOTSTRAP=1`! This [magic little line](https://github.com/hsivonen/packed_simd/blob/44985acd9b3e95aa6a58afcee352f63db4f0e9c3/build.rs) makes it so your STABLE toolchain can compile NIGHTLY crates! OMG! And **they** are NOT happy!

1. [Forbid setting RUSTC_BOOTSTRAP from build scripts](https://github.com/rust-lang/cargo/pull/6608)
2. [Forbid setting `RUSTC_BOOTSTRAP` from a build script](https://github.com/rust-lang/cargo/issues/7088)
3. [Allow setting RUSTC_BOOTSTRAP=1 on specific crates in the dependency graph from the top level of the build](https://github.com/rust-lang/cargo/issues/6627)

Why are our fellow Rustaceans unhappy perchance? Well…. let’s see!

> Just so I understand, you're confused as to why we would want to prohibit a stable compiler from using unstable features?
> 
> You are not bootstrapping rustc. Don't use RUSTC_BOOTSTRAP.
>
>—[sfackler](https://github.com/rust-lang/cargo/issues/6627#issuecomment-460389951)

:chudtantrum: You just… cant…. ok????

> That's why I suggested naming along the lines of `enable_features_that_future_rust_releases_may_break` without the word "bootstrap".
> —[hsivonen](https://github.com/rust-lang/cargo/issues/6627#issuecomment-460690098)

Nice name bozo! Really rolls off the tongue! Also, I like how their response to “you aren’t bootstrapping” is to just change the name of the flag to something else. Reminds me of that time that Republicans :marseytrump: were able to get the public to rally behind an end to estate taxes by calling them “Death Tax” :marseyxd:

>[@skade](https://github.com/skade) the user action is not fine because `RUSTC_BOOTSTRAP` is meant for bootstrapping rust, nothing more. It's no official feature of rust and never has been. It can be removed, changed, etc at any time. And in order for a right to exist, it has to be executed otherwise you'll soon notice you can't any more.
>
>Firefox devs have their reasons to use `RUSTC_BOOTSTRAP` and they should be allowed to keep their usage, and ideally simd and this allocator stuff they depend on should be stabilized. But the restrictions I propose don't stop them from doing it, they just make casual/accidental use harder. The more hoops you have to jump through, the better.
>
>—[est31](https://github.com/rust-lang/cargo/issues/7088#issuecomment-508171962)

So like it’s totally cool for rustc and Firefox to use this flag, but you don’t, ok? We know better than you! :marseysuit: Why dont you sit back while the big boys handle this?

There’s also [this](https://github.com/rust-lang/cargo/pull/6608#issuecomment-458514705) :marseylongpost:, I didn’t bother to read it but maybe you’d find it interesting.

Anyways, if you need to use unstable features in a stable rust version, and you’d not in a position to make your own new rustc compiler flag only for you, use `RUSTC-BOOTSTRAP`. It might make your coworkers mad :chudtantrum:, but it gets the job done :marseyretardchad:.