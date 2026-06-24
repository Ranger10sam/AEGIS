import type { Difficulty, StudyPhase } from "../lib/database.types";

export interface DsaProblemSeed {
  lc: number;
  title: string;
  difficulty: Difficulty;
}

export interface DsaPatternSeed {
  id: string;
  title: string;
  phase: StudyPhase;
  description: string;
  /** Core LC problems requiring only this pattern (CLAUDE.md §8). */
  problems: DsaProblemSeed[];
}

/**
 * The DSA pattern master list (CLAUDE.md §8). Philosophy: learn the pattern
 * deeply, then solve 4–6 targeted problems that need only that pattern. Don't
 * advance until confidence >= 3. Seeded into dsa_patterns + dsa_problems.
 */
export const DSA_PATTERNS: DsaPatternSeed[] = [
  // ── Phase 1 — Foundation ───────────────────────────────────────────────────
  {
    id: "arrays-hashing",
    title: "Arrays & Hashing",
    phase: 1,
    description:
      "Trade space for time with hash maps and sets. Frequency counts, seen-before lookups, and grouping turn O(n²) scans into single O(n) passes — the foundation almost every other pattern builds on.",
    problems: [
      { lc: 217, title: "Contains Duplicate", difficulty: "easy" },
      { lc: 242, title: "Valid Anagram", difficulty: "easy" },
      { lc: 1, title: "Two Sum", difficulty: "easy" },
      { lc: 49, title: "Group Anagrams", difficulty: "medium" },
      { lc: 347, title: "Top K Frequent Elements", difficulty: "medium" },
    ],
  },
  {
    id: "two-pointers",
    title: "Two Pointers",
    phase: 1,
    description:
      "Walk a sorted array from both ends (or at two speeds) to avoid nested loops. Converging pointers solve pair-sum, palindrome, and container problems in O(n) with O(1) extra space.",
    problems: [
      { lc: 125, title: "Valid Palindrome", difficulty: "easy" },
      {
        lc: 167,
        title: "Two Sum II - Input Array Is Sorted",
        difficulty: "medium",
      },
      { lc: 15, title: "3Sum", difficulty: "medium" },
      { lc: 11, title: "Container With Most Water", difficulty: "medium" },
    ],
  },
  {
    id: "sliding-window",
    title: "Sliding Window",
    phase: 1,
    description:
      "Maintain a moving range over a sequence, expanding and shrinking it instead of recomputing from scratch. The go-to for 'longest/shortest/contains' subarray or substring questions.",
    problems: [
      { lc: 643, title: "Maximum Average Subarray I", difficulty: "easy" },
      {
        lc: 3,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "medium",
      },
      {
        lc: 424,
        title: "Longest Repeating Character Replacement",
        difficulty: "medium",
      },
      { lc: 76, title: "Minimum Window Substring", difficulty: "hard" },
    ],
  },

  // ── Phase 2 — Core Medium ──────────────────────────────────────────────────
  {
    id: "stack-basics",
    title: "Stack",
    phase: 2,
    description:
      "Last-in-first-out structure for matching, ordering, and 'next greater' problems. A monotonic stack keeps elements in sorted order to answer span and histogram questions in linear time.",
    problems: [
      { lc: 20, title: "Valid Parentheses", difficulty: "easy" },
      { lc: 155, title: "Min Stack", difficulty: "medium" },
      { lc: 739, title: "Daily Temperatures", difficulty: "medium" },
      {
        lc: 84,
        title: "Largest Rectangle in Histogram",
        difficulty: "hard",
      },
    ],
  },
  {
    id: "binary-search",
    title: "Binary Search",
    phase: 2,
    description:
      "Halve the search space each step for O(log n). Works on sorted arrays and, more powerfully, on any monotonic 'search space' — the answer itself can be what you binary-search over.",
    problems: [
      { lc: 704, title: "Binary Search", difficulty: "easy" },
      { lc: 74, title: "Search a 2D Matrix", difficulty: "medium" },
      {
        lc: 153,
        title: "Find Minimum in Rotated Sorted Array",
        difficulty: "medium",
      },
      {
        lc: 33,
        title: "Search in Rotated Sorted Array",
        difficulty: "medium",
      },
    ],
  },
  {
    id: "linked-list",
    title: "Linked List",
    phase: 2,
    description:
      "Pointer manipulation: reversal, merging, and the fast/slow (tortoise-and-hare) technique for cycle detection and finding the middle. A dummy head node simplifies most edge cases.",
    problems: [
      { lc: 206, title: "Reverse Linked List", difficulty: "easy" },
      { lc: 21, title: "Merge Two Sorted Lists", difficulty: "easy" },
      { lc: 141, title: "Linked List Cycle", difficulty: "easy" },
      { lc: 143, title: "Reorder List", difficulty: "medium" },
    ],
  },
  {
    id: "trees-dfs",
    title: "Trees — DFS",
    phase: 2,
    description:
      "Depth-first recursion over binary trees. Most tree problems reduce to 'solve the subtrees, then combine' — pick the right traversal (pre/in/post-order) for what each node needs from its children.",
    problems: [
      { lc: 104, title: "Maximum Depth of Binary Tree", difficulty: "easy" },
      { lc: 226, title: "Invert Binary Tree", difficulty: "easy" },
      { lc: 100, title: "Same Tree", difficulty: "easy" },
      { lc: 112, title: "Path Sum", difficulty: "easy" },
    ],
  },
  {
    id: "trees-bfs",
    title: "Trees — BFS",
    phase: 2,
    description:
      "Breadth-first traversal with a queue, processing the tree level by level. The pattern behind level-order output, right-side view, and shortest-depth questions.",
    problems: [
      {
        lc: 102,
        title: "Binary Tree Level Order Traversal",
        difficulty: "medium",
      },
      { lc: 199, title: "Binary Tree Right Side View", difficulty: "medium" },
      { lc: 111, title: "Minimum Depth of Binary Tree", difficulty: "easy" },
    ],
  },
  {
    id: "backtracking",
    title: "Backtracking",
    phase: 2,
    description:
      "Build candidates incrementally and undo a choice when it can't lead to a solution. The template (choose → explore → un-choose) generates subsets, permutations, combinations, and grid paths.",
    problems: [
      { lc: 78, title: "Subsets", difficulty: "medium" },
      { lc: 46, title: "Permutations", difficulty: "medium" },
      { lc: 39, title: "Combination Sum", difficulty: "medium" },
      { lc: 79, title: "Word Search", difficulty: "medium" },
    ],
  },

  // ── Phase 3 — Interview-Critical ───────────────────────────────────────────
  {
    id: "heap-priority",
    title: "Heap / Priority Queue",
    phase: 3,
    description:
      "A heap keeps the min or max accessible in O(log n). The pattern for 'top K', 'kth largest', and streaming-median problems — often a size-K heap beats fully sorting.",
    problems: [
      {
        lc: 703,
        title: "Kth Largest Element in a Stream",
        difficulty: "easy",
      },
      { lc: 1046, title: "Last Stone Weight", difficulty: "easy" },
      {
        lc: 215,
        title: "Kth Largest Element in an Array",
        difficulty: "medium",
      },
      { lc: 973, title: "K Closest Points to Origin", difficulty: "medium" },
    ],
  },
  {
    id: "dp-1d",
    title: "DP — 1D",
    phase: 3,
    description:
      "Dynamic programming over a single dimension: define the state, find the recurrence, and build up an array (or two rolling variables). The house-robber and coin-change families live here.",
    problems: [
      { lc: 70, title: "Climbing Stairs", difficulty: "easy" },
      { lc: 198, title: "House Robber", difficulty: "medium" },
      { lc: 322, title: "Coin Change", difficulty: "medium" },
      { lc: 139, title: "Word Break", difficulty: "medium" },
    ],
  },
  {
    id: "dp-2d",
    title: "DP — 2D",
    phase: 3,
    description:
      "Dynamic programming on a grid or two sequences, where each cell depends on its neighbors. Path-counting and subsequence problems map onto a 2D table.",
    problems: [
      { lc: 62, title: "Unique Paths", difficulty: "medium" },
      { lc: 64, title: "Minimum Path Sum", difficulty: "medium" },
      { lc: 1143, title: "Longest Common Subsequence", difficulty: "medium" },
    ],
  },
  {
    id: "graphs-bfs-dfs",
    title: "Graphs — BFS/DFS",
    phase: 3,
    description:
      "Traverse a graph (often a grid or adjacency list) with BFS or DFS, tracking visited nodes to avoid cycles. The backbone of connected-components, flood-fill, and shortest-unweighted-path problems.",
    problems: [
      { lc: 200, title: "Number of Islands", difficulty: "medium" },
      { lc: 133, title: "Clone Graph", difficulty: "medium" },
      { lc: 417, title: "Pacific Atlantic Water Flow", difficulty: "medium" },
    ],
  },
  {
    id: "intervals",
    title: "Intervals",
    phase: 3,
    description:
      "Sort by start (or end), then sweep once, merging or counting overlaps. The pattern for merge-intervals, insert-interval, and minimum-removals-to-make-non-overlapping questions.",
    problems: [
      { lc: 57, title: "Insert Interval", difficulty: "medium" },
      { lc: 56, title: "Merge Intervals", difficulty: "medium" },
      { lc: 435, title: "Non-overlapping Intervals", difficulty: "medium" },
    ],
  },
];
