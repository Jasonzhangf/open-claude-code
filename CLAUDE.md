# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains a deep reverse-engineering analysis of **Claude Code v1.0.33**. The goal is to understand the system architecture, core mechanisms, and technical implementation of this AI programming assistant by analyzing its obfuscated source code. The repository includes analysis results, technical documentation, and scripts used in the process.

## High-Level Architecture

The analysis has revealed a sophisticated, multi-layered architecture. For a detailed diagram and component breakdown, refer to the "System Architecture Overview" section in `README.md`. The key layers are:

1.  **User Interaction Layer**: Interfaces like the CLI and IDE integrations.
2.  **Agent Core Dispatch Layer**: The central nervous system, featuring the `nO` main loop engine and the `h2A` asynchronous message queue for real-time steering.
3.  **Tool Execution & Management Layer**: A secure, sandboxed environment for running tools like `Read`, `Write`, `Bash`, and `Grep`. It includes components for concurrent execution and permission validation.
4.  **Storage & Persistence Layer**: Manages memory and context, using a combination of short-term session memory, compressed historical context, and long-term persistence via `CLAUDE.md`.

## Repository Structure

The main content is organized as follows. See `README.md` for a full file tree.

-   `claude_code_v_1.0.33/`: The primary workspace for the v1.0.33 analysis.
    -   `stage1_analysis_workspace/chunks/`: Contains the deobfuscated and beautified source code, split into 102 manageable chunks.
    -   `stage1_analysis_workspace/docs/`: Detailed technical documentation derived from the analysis.
    -   `stage1_analysis_workspace/scripts/`: Scripts used for code pre-processing (beautifying, splitting).
-   `work_doc_for_this/`: Contains Standard Operating Procedure (SOP) documents detailing the reverse-engineering methodology.

## Analysis Workflow & Commands

The analysis process involves pre-processing the source code and then performing static and dynamic analysis. The primary scripts for pre-processing are:

-   **Beautify Code**: Formats the raw, obfuscated source code for readability.
    ```bash
    node claude_code_v_1.0.33/stage1_analysis_workspace/scripts/beautify.js <source_file>
    ```
-   **Split Code**: Breaks the beautified code into smaller chunks for easier analysis.
    ```bash
    node claude_code_v_1.0.33/stage1_analysis_workspace/scripts/split.js <beautified_file>
    ```
