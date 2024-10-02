<script lang="ts">
  import Button from "./Button.svelte"
  import Icon from "@iconify/svelte"
  export let open = false
  export let cancellable = true
  export let onContinue: (event: SubmitEvent) => boolean = () => false
  export let onCancel: () => boolean = () => false

  let dialog: HTMLDialogElement
  $: dialog ? dialog.onkeydown = handleKeyDown : null
  $: open && dialog?.showModal()

  const handleSubmit = (event: SubmitEvent) => {
    const submitter = event.submitter as HTMLButtonElement | null
    open = onContinue(event)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault()
      open = false
    }
  }

  const handleTransitionEnd = () => !open && dialog.close()
</script>

<dialog class="dialog" class:dialog-open={open} bind:this={dialog} on:close={() => open = false} on:transitionend={handleTransitionEnd}>
  <form class="flex flex-col gap-8" on:submit|preventDefault={handleSubmit}>
    <div class="flex justify-center gap-4">
      <h2 class="text-2xl text-center font-bold">
        <slot name="title">Dialog</slot>
      </h2>
      {#if cancellable}
        <div class="flex flex-grow justify-end">
          <Button on:click={() => open = onCancel()}>
            <Icon icon="material-symbols:close-rounded"/>
          </Button>
        </div>
      {/if}
    </div>
    <slot name="content"/>
    <div class="flex justify-end gap-4">
      {#if cancellable}
        <Button class="button-secondary" on:click={() => open = onCancel()}>
          <slot name="cancel">Cancel</slot>
        </Button>
      {/if}
      <Button class="button-primary" type="submit">
        <slot name="continue">Continue</slot>
      </Button>
    </div>
  </form>
</dialog>