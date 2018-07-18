/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/* @flow strict-local */

import type { DebugReproArguments } from "../types.js";
import { SourceMapManager } from "./SourceMapManager.js";

export class DebugReproManager {
  constructor(configArgs: DebugReproArguments) {
    console.log("debug repro manager created");
    this._sourceMapManager = new SourceMapManager(configArgs.buckRoot, configArgs.sourcemaps);
    if (configArgs.sourcemaps) {
      this._sourceMapNames = configArgs.sourcemaps
        .filter(m => m.sourceMapFilename !== undefined)
        .map(m => m.sourceMapFilename);
    }
    this._usedSourceFiles = new Set();
  }

  _sourceMapManager: SourceMapManager;
  _usedSourceFiles: Set<string>;
  _sourceMapNames: Array<string>;

  addSourceFile(fileName: string) {
    if (!fileName.includes("node_modules"))
      this._usedSourceFiles.add(this._sourceMapManager.relativeToAbsolute(fileName));
  }

  getSourceFilePaths(): Array<{ absolute: string, relative: string }> {
    return Array.from(this._usedSourceFiles).map(absolutePath => {
      return {
        absolute: absolutePath,
        relative: this._sourceMapManager.absoluteToRelative(absolutePath),
      };
    });
  }

  getSourceMapPaths(): Array<string> {
    return this._sourceMapNames;
  }
}