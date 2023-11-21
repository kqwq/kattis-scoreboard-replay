<script>
    import { onMount } from 'svelte';
    export let start_time;
    export let competition;
    
    let comp_file;
    if (competition.text == 'Rocky Mountain Regional 2023') {
        comp_file = 'rmc2023.csv';
    } else if (competition.text == 'Mid-Atlantic Regional 2022') {
        comp_file = 'mac2022.csv';
    }

    let num_problems;
    let live_data = {
    solveCounts: [],
    minute: 0,
    ranks: [],
};

    const load_data = async () => {
        if (!comp_file) return;
        const data = await fetch('/api/content?file=' + comp_file).then(r => r.json());
        return data;
    }

    const getLiveData = (data, numProblems, firsts) => {
        const time = Date.now();
        const minute = Math.floor((time - start_time)/60e3);
        const ranks = data.map(({ name, problems }) => {
            problems = problems.map((p,i) => {
                if(!p) return undefined;
                if(p.time > minute) return undefined;
                return {
                    ...p,
                    first: firsts[i] == p.time
                };
            });
            let count = 0;
            let penalty = 0;
            for(let i = 0; i < numProblems; i++){
                if(problems[i] != undefined){
                    count++;
                    penalty += 20 * (problems[i].attempts - 1) + problems[i].time;
                }
            }
            return {
                name,
                count,
                penalty,
                problems,
            }
        });
        ranks.sort((a, b) => {
            if(a.count > b.count) return -1;
            if(a.count< b .count) return 1;
            if(a.penalty < b.penalty) return -1;
            if(a.penalty > b.penalty) return 1;
            return 0; // not implementing full tie breaker rules 
        });

        const solveCounts = new Array(numProblems).fill(0);
        for(const {problems} of ranks){
            for(let i = 0; i < numProblems; i++){
                if(problems[i] != undefined) solveCounts[i]++;
            }
        }

        return {
            solveCounts,
            minute,
            ranks,
        };
    }

    onMount(async () => {
        await load_data().then((data) => {
            const numProblems = data[0].problems.length;
            const firsts = new Array(numProblems).fill(301);
            for(const { problems } of data) {
                for(let i = 0; i < numProblems; i++){
                    if(problems[i] == undefined) continue;
                    firsts[i] = Math.min(firsts[i], problems[i].time);
                }
            }

            live_data = getLiveData(data, numProblems, firsts);
            //live_data.ranks = live_data.ranks[0];
            num_problems = numProblems;
            setInterval(() => live_data = getLiveData(data, numProblems, firsts), 10000);
        })
    })
    


    

</script>


<div class=" pt-12 overflow-x-auto">
    <table class="table table-zebra text-lg">
        <thead>
            <tr class="text-lg">
                <th>Rank</th>
                <th>Team</th>
                <th align="center">Solves</th>
                <th align="center">Time</th>
                {#each Array(num_problems) as _, index (index)}
                    <th>{String.fromCharCode(index + 65)}</th>
                {/each}
            </tr>
        </thead>
            <tbody>
                {#each live_data.ranks as rank, i}
                    <tr>
                        <th>{i+1}</th>
                        <td>{rank.name}</td>
                        <td align="center">{rank.count}</td>
                        <td align="center">{rank.penalty}</td>
                        {#each rank.problems as problem, j}
                            {#if problem}
                                <td>
                                    <div class="flex items-center gap-2">
                                        <span class="text-2xl">✅</span>
                                        <div class="flex flex-col text-xs">
                                            <b>{problem.attempts}</b>
                                            <span class="text-neutral-400">{problem.time}min</span>
                                        </div>
                                    </div>
                                </td>
                            {:else}
                                <td></td>
                            {/if}
                        {/each}
                    </tr>
                {/each}
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>Totals:</td>
                    {#each live_data.solveCounts as count}
                        <td>{count}</td>
                    {/each}
                </tr>
            </tbody>
    </table>
</div>
