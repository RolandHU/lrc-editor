<script lang="ts">
  import Icon from "@iconify/svelte"
  export let open = false
  export let cancellable = true
  export let onContinue: () => boolean = () => false
  export let onCancel: () => boolean = () => false

  let dialog: HTMLDialogElement
  $: open ? dialog?.showModal() : dialog?.close()
</script>

<dialog class="w-full max-w-2xl flex flex-col gap-8 p-8 rounded-2xl text-white bg-zinc-900 backdrop:bg-zinc-950/75 backdrop:backdrop-blur-md" on:close={() => open = false} bind:this={dialog}>
  <div class="flex justify-between gap-4">
    <h2 class="text-2xl font-bold">
      <slot name="title">Dialog</slot>
    </h2>
    {#if cancellable}
      <button class="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors duration-200" on:click={() => open = onCancel()}>
        <Icon icon="material-symbols:close-rounded"/>
      </button>
    {/if}
  </div>
  <form class="flex flex-col gap-4" on:submit|preventDefault>
    <slot name="content"/>
    <div class="flex justify-end gap-4">
      <button class="px-8 py-2 rounded-full font-semibold bg-violet-700 hover:bg-violet-900 transition-colors duration-200" on:click={() => open = onContinue()}>
        <slot name="continue">Continue</slot>
      </button>
      {#if cancellable}      
        <button class="px-8 py-2 rounded-full font-semibold text-black bg-zinc-50 hover:bg-zinc-400 transition-colors duration-200" on:click={() => open = onCancel()}>
          <slot name="cancel">Cancel</slot>
        </button>
      {/if}
    </div>
  </form>
</dialog>