export default function Intro() {
    return (
        <div className="intro">
            <h2>Trying it out</h2>
            <ul>
                <li>
                    Add a job to the queue by clicking the <strong>add</strong> button. The Queue can hold a maximum of 10 jobs.
                </li>
                <li>
                    Consume a job by clicking the <strong>dequeue</strong> button.
                </li>
                <li>
                    Continue to add jobs. When a job is <span className="nudged">Nudged</span> it swaps places with the new job, and it
                    stays in the last position of the queue.
                </li>
                <li>
                    If you want the job consumer can take a way a job every tick. Start it by clicking
                    <strong> start consumer</strong>.
                </li>
            </ul>

            <h2>How it works</h2>
            <p>
                When a new job is inserted into the queue, we check if there is any existing job that is bigger and it's going to take
                longer to process. If there is one, we swap its position with the new job. This process is known as a "nudge." However, we
                only allow a job to be nudged once to ensure that the algorithm is fast and fair.
            </p>
            <p>
                There are only two type of jobs, small and big. <span className="nudged">Nudged</span> jobs are marked with a dotted line.
                The text on the job it's the "arrival timestamp" (in mm:ss.ms), it makes it easier to confirm when a job is older than
                another job. Finally, jobs that arrive closely together tend to have similar color, that way, when a job "jumps" over
                another it kinda looks out of place.
            </p>
            <p>
                <a href="https://github.com/eduardoromero/nudge-react" target="_blank">
                    Here
                </a>{' '}
                is the code and{' '}
                <a href="https://github.com/eduardoromero/QNudge" target="_blank">
                    here
                </a>{' '}
                is a simulation that generates runs with a lot more data (20,000 items) and then prints a summary of the average time in
                queue for both FCFS and with Nudge.
            </p>
        </div>
    );
}
