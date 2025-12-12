<script lang="ts">
  import Map from "$lib/components/Map.svelte";
  import CollapsibleCard from "$lib/components/CollapsibleCard.svelte";

  let prompt = $state("");
  let result = $state(null);
  let status = $state<"idle" | "generating" | "executing">("idle");
  let generatedQuery = $state("");
  let activeSection = $state<"query" | "sql" | "map">("query");

  const icons = {
    sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M3 9h4"/><path d="M3 5h4"/></svg>`,
    github: `<svg width="20" height="20" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="#1B1F23"/>
</svg>
`,
    database: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 2 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
    mapPin: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    logo: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m12 16 4-4-4-4"/><path d="M8 12h8"/></svg>`,
  };

  async function handleSubmit(e?: Event) {
    if (e) e.preventDefault();
    if (!prompt) return;

    status = "generating";
    result = null;
    generatedQuery = "";

    try {
      // Step 1: Generate SQL
      const genRes = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const genData = await genRes.json();

      if (genData.error) throw new Error(genData.error);

      generatedQuery = genData.query;
      status = "executing";

      // Auto-switch to SQL section
      activeSection = "sql";

      // Step 2: Execute SQL
      const execRes = await fetch("/api/db/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: generatedQuery }),
      });
      const execData = await execRes.json();

      if (execData.error) throw new Error(execData.error);

      result = execData.result;

      // Auto-switch to Map section
      activeSection = "map";
    } catch (err) {
      console.error(err);
      alert("An error occurred. Check console for details.");
    } finally {
      status = "idle";
    }
  }

  function setExample(text: string) {
    prompt = text;
  }

  function highlightSql(sql: string) {
    if (!sql) return "";

    // Normalize whitespace to single spaces to ensure clean formatting
    const normalized = sql.replace(/\s+/g, " ").trim();

    // Escape HTML first
    const escaped = normalized
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Combined regex for single-pass highlighting
    // Order: Strings, Keywords (Longer first), Functions, Numbers
    const pattern =
      /('([^']*)')|(\b(SELECT|FROM|WHERE|AND|OR|LIMIT|ORDER BY|GROUP BY|INSERT|UPDATE|DELETE|ILIKE|IS|NULL|NOT|AS|IN|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN|CROSS JOIN|JOIN|ON|LEFT|RIGHT|INNER|OUTER|CROSS|UNION|ALL|DISTINCT|CASE|WHEN|THEN|ELSE|END)\b)|(\bST_[a-zA-Z0-9_]+\b)|(\b\d+\b)/gi;

    const highlighted = escaped.replace(
      pattern,
      (match, str, strContent, keyword, keywordContent, func, num, offset) => {
        if (str) return `<span class="text-green-600">${match}</span>`;

        if (keyword) {
          const upper = match.toUpperCase();
          let prefix = "";

          // Major clauses - New line
          if (
            [
              "SELECT",
              "FROM",
              "WHERE",
              "LIMIT",
              "ORDER BY",
              "GROUP BY",
              "UNION",
              "INSERT",
              "UPDATE",
              "DELETE",
              "HAVING",
            ].includes(upper)
          ) {
            if (offset > 0) prefix = "\n";
          }
          // Conjunctions - New line + Indent
          else if (["AND", "OR"].includes(upper)) {
            if (offset > 0) prefix = "\n  ";
          }
          // Joins - New line
          else if (
            [
              "LEFT JOIN",
              "RIGHT JOIN",
              "INNER JOIN",
              "OUTER JOIN",
              "CROSS JOIN",
              "JOIN",
            ].includes(upper)
          ) {
            if (offset > 0) prefix = "\n";
          }

          return `${prefix}<span class="text-blue-600 font-bold">${match}</span>`;
        }

        if (func) return `<span class="text-purple-600">${match}</span>`;
        if (num) return `<span class="text-orange-600">${match}</span>`;
        return match;
      }
    );

    // Add line numbers
    const lines = highlighted.split("\n");
    return lines
      .map(
        (line, i) =>
          `<div class="flex gap-4">
         <span class="text-stone-300 select-none w-6 text-right flex-shrink-0">${i + 1}</span>
         <span class="whitespace-pre-wrap break-all font-mono text-sm">${line}</span>
       </div>`
      )
      .join("");
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
</script>

<svelte:head>
  <title>SUPA WORKS</title>
</svelte:head>

<div class="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans">
  <!-- Header -->
  <header
    class="px-8 py-6 flex justify-between items-center border-b border-stone-200 bg-white/50 backdrop-blur-sm sticky top-0 z-50"
  >
    <div class="flex items-center gap-3">
      <span class="font-bold text-lg tracking-tight"
        >Natural Language to SQL</span
      >
    </div>
    <div class="flex items-center gap-2 text-stone-500 text-sm font-medium">
      {@html icons.github}
    </div>
  </header>

  <main class="max-w-7xl mx-auto p-6 lg:p-12">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <!-- Left Column: Info & Context -->
      <div class="lg:col-span-5 space-y-10">
        <div class="space-y-6">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-white text-xs font-medium"
          >
            {@html icons.sparkles}
            <span>Natural Language to SQL</span>
          </div>

          <h1
            class="text-4xl lg:text-5xl font-bold leading-tight text-stone-900"
          >
            Query Geographic Data with Plain English
          </h1>

          <p class="text-lg text-stone-600 leading-relaxed">
            Transform natural language questions into precise SQL queries
            powered by advanced language models. This demo showcases how AI can
            bridge the gap between human intuition and database operations.
          </p>
        </div>

        <div class="space-y-8">
          <div class="flex gap-4">
            <div
              class="shrink-0 w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-600"
            >
              1
            </div>
            <div>
              <h3 class="font-bold text-stone-900 mb-1">Ask Your Question</h3>
              <p class="text-stone-600 text-sm">
                Enter your question in natural language. Our system understands
                context, intent, and the underlying database schema.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div
              class="shrink-0 w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-600"
            >
              2
            </div>
            <div>
              <h3 class="font-bold text-stone-900 mb-1">AI Translation</h3>
              <p class="text-stone-600 text-sm">
                The LLM processes your query and generates optimized SQL that
                matches your intent with proper syntax.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div
              class="shrink-0 w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-600"
            >
              3
            </div>
            <div>
              <h3 class="font-bold text-stone-900 mb-1">Geographic Results</h3>
              <p class="text-stone-600 text-sm">
                The SQL query runs against our GIS database and returns
                geographic data visualized on an interactive map.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Interactive Elements -->
      <div class="lg:col-span-7 space-y-6">
        <!-- 1. Your Query -->
        <CollapsibleCard
          title="Your Query"
          icon={icons.sparkles}
          isOpen={activeSection === "query"}
          onToggle={() =>
            (activeSection = activeSection === "query" ? "query" : "query")}
        >
          {#snippet preview()}
            {prompt || "No query entered yet"}
          {/snippet}

          <form onsubmit={handleSubmit} class="relative">
            <textarea
              bind:value={prompt}
              placeholder="e.g. Show me trees nerby a bus stop. Limit by 100..."
              class="w-full p-4 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none resize-none h-32 text-stone-800 placeholder:text-stone-400"
              onkeydown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            ></textarea>

            <!-- Quick Prompts -->
            <div class="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onclick={() =>
                  setExample(
                    "Find all bus stops within 1m of a tree. Limit by 100."
                  )}
                class="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs rounded-full transition-colors border border-stone-200"
              >
                Bus stops with trees
              </button>
              <button
                type="button"
                onclick={() => setExample("Find all railways.")}
                class="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs rounded-full transition-colors border border-stone-200"
              >
                Railways
              </button>
              <button
                type="button"
                onclick={() => setExample("Show me all cemeteries.")}
                class="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs rounded-full transition-colors border border-stone-200"
              >
                Cemeteries
              </button>
            </div>
            <div class="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={status !== "idle" || !prompt}
                class="px-6 py-2.5 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {#if status === "generating"}
                  <svg
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Thinking...</span>
                {:else}
                  <span>Generate SQL</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg
                  >
                {/if}
              </button>
            </div>
          </form>
        </CollapsibleCard>

        <!-- 2. Generated SQL -->
        <CollapsibleCard
          title="Generated SQL"
          icon={icons.database}
          isOpen={activeSection === "sql"}
          onToggle={() =>
            (activeSection = activeSection === "sql" ? "sql" : "sql")}
        >
          {#snippet preview()}
            {#if generatedQuery}
              <span class="font-mono text-xs">{generatedQuery}</span>
            {:else}
              <span class="italic">Waiting for query...</span>
            {/if}
          {/snippet}

          <div
            class="bg-stone-50 rounded-lg border border-stone-200 p-4 font-mono text-sm text-stone-700 overflow-x-auto relative overflow-hidden group"
          >
            {#if status === "generating"}
              <div class="absolute top-0 left-0 w-full h-1 bg-stone-100">
                <div
                  class="h-full bg-blue-500 animate-progress-indeterminate"
                ></div>
              </div>
            {/if}

            {#if generatedQuery}
              <button
                onclick={() => copyToClipboard(generatedQuery)}
                class="absolute top-2 right-2 p-1.5 bg-white border border-stone-200 rounded-md text-stone-500 hover:text-stone-900 hover:border-stone-300 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
                title="Copy SQL"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  ><rect
                    width="14"
                    height="14"
                    x="8"
                    y="8"
                    rx="2"
                    ry="2"
                  /><path
                    d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
                  /></svg
                >
              </button>
              {@html highlightSql(generatedQuery)}
            {:else if status === "generating"}
              <div class="flex flex-col gap-2 pt-2">
                <div
                  class="flex items-center gap-2 text-stone-400 animate-pulse"
                >
                  <div
                    class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  ></div>
                  Generating SQL...
                </div>
                <div class="space-y-2 opacity-50">
                  <div
                    class="h-4 bg-stone-200 rounded w-3/4 animate-pulse"
                  ></div>
                  <div
                    class="h-4 bg-stone-200 rounded w-1/2 animate-pulse delay-75"
                  ></div>
                </div>
              </div>
            {:else}
              <span class="text-stone-400 italic"
                >No SQL generated yet. Enter a query above.</span
              >
            {/if}
          </div>

          {#if generatedQuery}
            <div class="mt-2 flex justify-end">
              <span
                class="text-[10px] uppercase tracking-wider font-semibold text-stone-400"
              >
                Generated with <strong>supa:coder</strong>
              </span>
            </div>
          {/if}

          {#if generatedQuery && status === "executing"}
            <div
              class="mt-3 text-sm text-blue-600 flex items-center gap-2 animate-pulse"
            >
              <svg
                class="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Executing query on database...
            </div>
          {/if}
        </CollapsibleCard>

        <!-- 3. Map Visualization -->
        <CollapsibleCard
          title="Map Visualization"
          icon={icons.mapPin}
          isOpen={activeSection === "map"}
          onToggle={() =>
            (activeSection = activeSection === "map" ? "map" : "map")}
        >
          {#snippet preview()}
            {#if result}
              {result.length} features found
            {:else}
              <span class="italic">No data yet</span>
            {/if}
          {/snippet}

          <div
            class="rounded-lg overflow-hidden border border-stone-200 bg-stone-100 min-h-[400px] relative"
          >
            {#if status === "executing"}
              <div class="absolute top-0 left-0 w-full h-1 bg-stone-200 z-10">
                <div
                  class="h-full bg-green-500 animate-progress-indeterminate"
                ></div>
              </div>
              <div
                class="absolute inset-0 bg-white/50 backdrop-blur-sm z-0 flex items-center justify-center"
              >
                <div class="flex flex-col items-center gap-3">
                  <div class="relative w-12 h-12">
                    <div
                      class="absolute inset-0 border-4 border-stone-200 rounded-full"
                    ></div>
                    <div
                      class="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"
                    ></div>
                  </div>
                  <span class="text-stone-600 font-medium animate-pulse"
                    >Querying Database...</span
                  >
                </div>
              </div>
            {/if}

            {#if result}
              <Map features={result} />
            {:else}
              <div
                class="h-[400px] flex flex-col items-center justify-center text-stone-400 gap-4"
              >
                {@html icons.mapPin}
                <p>Your GIS map will render here</p>
                <p class="text-xs">Connect your map visualization logic</p>
              </div>
            {/if}
          </div>
        </CollapsibleCard>
      </div>
    </div>
  </main>

  <!-- SUPA Badge -->
  <a
    href="https://supa.works"
    target="_blank"
    class="fixed bottom-6 right-6 z-50 bg-white/90 backdrop-blur border border-stone-200 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:border-stone-300 transition-all group"
  >
    <span class="text-amber-500">⚡</span>
    <span
      >Inference by <span class="font-bold group-hover:text-black"
        >supa.works</span
      >
    </span>
  </a>
</div>

<style>
  @keyframes progress-indeterminate {
    0% {
      left: -100%;
      width: 50%;
    }
    50% {
      left: 25%;
      width: 75%;
    }
    100% {
      left: 100%;
      width: 50%;
    }
  }
  .animate-progress-indeterminate {
    position: relative;
    animation: progress-indeterminate 1.5s infinite linear;
  }
</style>
