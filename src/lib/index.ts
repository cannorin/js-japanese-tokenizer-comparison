/*
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
*/

import { tokenize as wakachigaki } from "wakachigaki";
import TinySegmenter from "tiny-segmenter";
import { loadDefaultJapaneseParser } from "budoux";

const regex =
  /(?<=\p{L})(?=\p{N})|(?<=\p{N})(?=\p{L})|(?<=\p{Script=Hiragana})(?=\p{Script=Katakana})|(?<=\p{Script=Katakana})(?=\p{Script=Hiragana})|(?<=\p{Script=Han})(?=\p{Script=Katakana})|(?<=\p{Script=Katakana})(?=\p{Script=Han})|(?<=\p{Script=Han})(?=\p{Script=Hiragana})|(?<=\p{Script=Hiragana})(?=\p{Script=Han})|(?<=\p{Script=Latin})(?=[^\p{Script=Latin}\p{P}\p{Z}])|(?<=[^\p{Script=Latin}\p{P}\p{Z}])(?=\p{Script=Latin})|(?<=\p{L})(?=[\p{P}\p{Z}])|(?<=[\p{P}\p{Z}])(?=\p{L})|(?<=[^\p{Z}])(?=\p{Z})|(?<=\p{Z})(?=[^\p{Z}])/gu;

const intlSegmenter = new Intl.Segmenter("ja-JP", { granularity: "word" });

const tinySegmenter = new TinySegmenter();

const budoux = loadDefaultJapaneseParser();

export const tools = [
  "regex",
  "intl.segmenter",
  "tiny-segmenter",
  "wakachigaki",
  "budoux"
] as const;

export type Tool = (typeof tools)[number];

export function isValidTool(x: unknown): x is Tool {
  return tools.includes(x);
}

export function tokenize(tool: Tool, input: string) {
  switch (tool) {
    case "regex": {
      return input.split(regex);
    }
    case "intl.segmenter": {
      return Array.from(intlSegmenter.segment(input)).map((x) => x.segment);
    }
    case "tiny-segmenter": {
      return tinySegmenter.segment(input);
    }
    case "wakachigaki": {
      return wakachigaki(input);
    }
    case "budoux": {
      return budoux.parse(input);
    }
  }
}

export function measureExecutionTime<Args extends unknown[], Result>(
  f: (...args: Args) => Result,
  ...args: Args
): { result: Result; time_ms: number } {
  const startTime = performance.now();
  const result = f(...args);
  const endTime = performance.now();
  return { result, time_ms: endTime - startTime };
}
