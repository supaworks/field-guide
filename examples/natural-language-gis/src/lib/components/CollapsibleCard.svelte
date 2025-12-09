<script lang="ts">
  import { slide } from "svelte/transition";

  let {
    title,
    icon,
    isOpen = false,
    onToggle,
    children,
    preview,
  } = $props<{
    title: string;
    icon?: any; // SVG component or string
    isOpen?: boolean;
    onToggle?: () => void;
    children?: any;
    preview?: any;
  }>();
</script>

<div
  class="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden transition-all duration-300"
>
  <!-- Header -->
  <button
    onclick={onToggle}
    class="w-full flex items-center justify-between p-6 text-left hover:bg-stone-50 transition-colors"
  >
    <div class="flex items-center gap-3">
      {#if icon}
        <span class="text-stone-600">
          {@html icon}
        </span>
      {/if}
      <h3 class="font-semibold text-stone-800">{title}</h3>
    </div>

    <div class="flex items-center gap-4">
      {#if !isOpen && preview}
        <div
          class="text-stone-400 text-sm truncate max-w-[200px] md:max-w-[300px]"
        >
          {@render preview()}
        </div>
      {/if}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-stone-400 transition-transform duration-300 {isOpen
          ? 'rotate-180'
          : ''}"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  </button>

  <!-- Content -->
  {#if isOpen}
    <div transition:slide={{ duration: 300 }} class="border-t border-stone-100">
      <div class="p-6 pt-2">
        {@render children?.()}
      </div>
    </div>
  {/if}
</div>
