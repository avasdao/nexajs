# Built-in extension package

## What is this extension package? Do I need it?

If you are running `VS Code`, `Code OSS` or derived product built from the VS Code repository,
such as [VSCodium](https://github.com/VSCodium/vscodium), you do not need to install this extension package as
the included extensions are already present - "built-in".

Built-in extensions are built-along and included in `VS Code` and `Code OSS`.
In consequence they may be expected to be present and used by other extensions.
They are part of the [vscode GitHub repository](https://github.com/microsoft/vscode/tree/master/) and
generally contribute basic functionality such as textmate grammars, used for syntax-highlighting, for some
of the most popular programming languages. In some cases, more substantial features are contributed through
built-in extensions (e.g. Typescript, Markdown, git, ...). Please see the description above to learn what
this specific extension does.

To learn more about built-in extensions, including how they are built and packaged,
please see [vscode-builtin-extensions](https://github.com/eclipse-theia/vscode-builtin-extensions).

This extension package may be useful for builders of 'VS Code' derived products so it can be
included as a dependency or be installed within an extension or plugin directory instead of listing each
individual extension as a dependency.
