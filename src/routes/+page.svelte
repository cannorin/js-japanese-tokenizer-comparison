<!--
  Copyright (c) 2024 cannorin

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
  OR OTHER DEALINGS IN THE SOFTWARE.
-->

<script lang="ts">
  import { tools, measureExecutionTime, tokenize, type Tool } from "$lib";
  import { dummyText } from "$lib/constant";

  let tool: Tool = "intl.segmenter";
  let input = dummyText;
  let backend = false;
  let result: { result: string[]; time_ms: number } | undefined = undefined;

  async function runTokenization() {
    if (backend) {
      const resp = await fetch("/api/tokenize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, input })
      });
      result = await resp.json();
    } else {
      result = measureExecutionTime(tokenize, tool, input);
    }
  }
</script>

<div class="flex min-h-screen min-w-full flex-col gap-6 p-6 lg:flex-row">
  <div class="flex grow basis-1 flex-col gap-4 lg:min-h-full">
    <div class="flex items-center justify-start gap-4">
      <select class="rounded border border-gray-300 px-2" id="tool" bind:value={tool}>
        {#each tools as tool}
          <option value={tool}>{tool}</option>
        {/each}
      </select>

      <div>
        <label for="backend">Server Action:</label>
        <input type="checkbox" id="backend" bind:checked={backend} />
      </div>

      <button class="rounded border border-gray-600 px-4" on:click={runTokenization}>実行</button>
    </div>
    <textarea
      class="grow rounded border border-gray-300"
      id="input"
      bind:value={input}
      rows="4"
      cols="50"
    ></textarea>
  </div>

  <div class="flex grow basis-1 flex-col gap-4 lg:min-h-full">
    <div>
      <p>経過時間: {result?.time_ms.toFixed(2) ?? -1} ms</p>
    </div>
    <div
      class="flex grow flex-wrap items-start justify-start gap-x-1 gap-y-1 rounded border border-gray-300 p-2"
    >
      {#each result?.result ?? [] as token}
        <span class="h-5 rounded bg-gray-200 px-[4px] py-[2px] text-xs">
          {token}
        </span>
      {/each}
    </div>
  </div>
</div>
