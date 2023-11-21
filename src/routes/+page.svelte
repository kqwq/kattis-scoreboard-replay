<script>
    import {database} from '$lib/firebase.js';
    import { ref, set, get} from 'firebase/database';
    import Replay from '$lib/Replay.svelte';

    const data_ref = ref(database, '/replay');
    let start_time;
    let selected_comp;

    
    get(data_ref).then((snapshot) => {
        let val = snapshot.val();
        if (val) {
            console.log(val);
            start_time = val.start_time;
            if (val.competition)
                selected_comp = val.competition;
        }
    }).catch((error) => {
        console.error(error);
    });

    function end_replay() {
        set(data_ref, null);
        start_time = "";
    }

    function start_replay() {
        let current_time = new Date().getTime();
        let new_replay = {
            start_time: current_time,
            competition: selected_comp
        }
        set(data_ref, new_replay);
        start_time = current_time;
    }

    let comps = [
        {
            id: 1,
            text: 'Rocky Mountain Regional 2023'
        },
        {
            id: 2,
            text: 'Mid-Atlantic Regional 2022'
        }
    ]

</script>

<h1 class="text-4xl font-bold pb-4">Kattis Scoreboard Replay</h1>

{#if start_time && selected_comp}
<div class="flex flex-col gap-4 w-fit">
    <p class="text-xl">Current Competition: <b>{selected_comp.text}</b></p>
    <button class="btn btn-error text-lg" on:click={end_replay}>End Replay</button>
</div>
<Replay {start_time} competition={selected_comp}/>
{:else}
<form class="flex gap-8 items-center" on:submit|preventDefault={start_replay}>
    <select bind:value={selected_comp} class="px-2 py-1 rounded-md bg-base-200">
        {#each comps as comp}
            <option value={comp}>{comp.text}</option>
        {/each}
    </select>
    <button type="submit" disabled={!selected_comp} class="btn btn-primary text-lg">Start Replay</button>
</form>
{/if}