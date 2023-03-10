# Nudging a Queue

#### Improving time in queue while maintaining fairness

This is a simple visualization describing how Nudging works. You can interact with it
here: http://eduardoromero.github.io/nudge-react

## What is Nudge?

[Nudge](https://arxiv.org/abs/2106.01492) is a scheduling policy. In the context of Queueing theory, the policy impacts
the performance of a scheduling algorithm.

"First Come, First Served" or FIFO is one of the most popular scheduling policies. It's simple to understand and
implement. It's also fair, and in general terms it minimizes the time in queue across jobs for any finite number of
sequence of jobs.

Nudge is also very simple and intuitive, it maintains the characteristics of FCFS and
incorporates a bit of prioritization for small jobs, which helps tail latency.

### Nudge

The algorithm works the following way:

> When a small job arrives to the queue, the scheduler checks for the job immediately ahead of it. If that job is bigger
> then we swap their position in the queue, and prioritize the smaller job.
>
>And there's a limit, a bigger job can only be "jumped" once.

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

## Links
- [Nudge Paper](https://dl.acm.org/doi/abs/10.1145/3410220.3460102).
- [Nudge introduction video](https://www.youtube.com/watch?v=G3NWAOlHpoI) from SIGMETRICS 2021.
- [Proof](https://dl.acm.org/doi/abs/10.1145/3570610) that with weaker conditions still make it better than FIFO for
  light-tailed job distributions.