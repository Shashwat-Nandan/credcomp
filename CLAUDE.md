## workflow orchestration

### 1. Plan Mode Default
- Enter Plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- if something goes sideways, STOP and re plan immediately - don't keep pushing.
- use plan mode for verification steps, not just building
- write detailed specs upfront to reduce ambiguity

### 2. Subagent strategy
- Use subagents liberally to keep main context window clean
- offload research, exploration, and parallel analysis to subagents
- for complex problems, throw some compute at it via subagents
- One tack per subagent for focused execution

### 3. Self Improvement Loop
- After any correction from the user: update 'tasks/lessons.md' with the pattern
- write rules for yourself that prevent the same mistake
Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification before done
- never mark a task complete without proving it works
- diff behaviour between main and your changes when relevant
- Ask yourself "would a staff engineer approve this?"
- run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- for non trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "knowing everything I know now, implement the elegant solution"
- skip this for simple, obvious fixes - don't over engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand holding
- Point at logs, errors, failing tests - then resolve them
- zero context switching required from the user
- go fix failing CI tests without being told how

## Task Management
1. **Plan First**: write plan to 'tasks/todo.md' with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to 'tasks/todo.md'
6. **Capture Lessons**: Update 'tasks/lessons.md' after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code
- **No laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Change should only touch what's necessary. avoid introducing bugs.