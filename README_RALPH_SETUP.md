# How to use these files with Ralph in Antigravity

Copy these three files into the Irish Grocer project root:

- `prompt.md` — instructions supplied to every Ralph iteration.
- `PRD.md` — discrete tasks for Ralph to execute one per iteration.
- `progress.txt` — persistent progress log.

Project root:
`C:\Users\kumar\Downloads\irishweb\website`

## Important: identify which Ralph interface you are using

There are multiple Ralph implementations. Do not assume their configuration or runner commands are interchangeable.

### If using the “Ralph Loop for Antigravity” sidebar extension

1. Open the Irish Grocer project folder as the workspace.
2. Open the Ralph Loop sidebar.
3. Set **Task File** to `PRD.md`.
4. Set **Prompt File** to `prompt.md`.
5. Set **Progress File** to `progress.txt`.
6. Choose Fast mode and a suitable model.
7. Set a small initial maximum, such as 3 iterations, and inspect the results before continuing.
8. Start the loop with the play button.

The extension documentation describes `PRD.md` as the read-only task specification, `progress.txt` as the progress log, and `prompt.md` as optional custom instructions. It processes discrete tasks across iterations.

### If using the globally installed `agy` Ralph plugin

The previously installed plugin directory was:
`C:\Users\kumar\.gemini\config\plugins\ralph`

Before running it, inspect its own `plugin.json`, skill instructions, `scripts\ralph.sh`, bundled `scripts\prompt.md`, and `scripts\prd.json.example`. This plugin may use a JSON PRD and a shell runner instead of the sidebar extension's Markdown task file.

Do not guess the command. Follow the exact invocation and PRD schema from the installed plugin's own instructions. On Windows, check whether its shell runner requires Git Bash or WSL.

If the installed plugin expects `prd.json`, convert the stories in `PRD.md` using the exact schema in its local `prd.json.example`; do not hand-invent a different schema.

## Git safety warning

Your project previously showed many uncommitted changes. Some Ralph implementations may automatically create commits. Before starting any loop, inspect the installed runner and confirm that automatic commit behavior is disabled. If it cannot be disabled, first create a safe backup/checkpoint of your current work and verify that the runner will not accidentally commit unrelated changes. Do not push anything to GitHub as part of this workflow.
