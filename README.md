# Nudging a Queue

#### Improving time in queue while maintaining fairness

This is a simple visualization describing how Nudging works. You can interact with it
here: http://eduardoromero.github.io/nudge-react

## What is Nudge?

[Nudge](https://arxiv.org/abs/2106.01492) is a scheduling policy. In the context of Queueing theory, the policy impacts
the performance of a scheduling algorithm.

"First Come, First Served" or FIFO is simple to understand and implement. It's also fair. It's one of the
most popular algorithms in practice.


## Related work

This project follows the same behavior as the **SimpleNudgingStorage** I build
in [this simulation](https://github.com/eduardoromero/QNudge).

It has a few constrains:

- It's limited to 10 items in the queue, that makes it easy understand what's happening on a computer screen.
- Jobs are manually added via a button.
- Jobs are consumed on a timer or manually clicking a button.
- It's been simplified to only two job sizes big and small.
- There's no concept of game title and configuration. However, each job is colored and has a timestamp so it's clear to
  differentiate and to understand the arrival time of the job for the place in the queue.

