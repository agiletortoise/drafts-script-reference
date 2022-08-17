"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = exports.gitIsInstalled = void 0;
const child_process_1 = require("child_process");
const models_1 = require("../../models");
const base_path_1 = require("../utils/base-path");
const TEN_MEGABYTES = 1024 * 10000;
function git(...args) {
    return (0, child_process_1.spawnSync)("git", args, {
        encoding: "utf-8",
        windowsHide: true,
        maxBuffer: TEN_MEGABYTES,
    });
}
exports.gitIsInstalled = git("--version").status === 0;
/**
 * Stores data of a repository.
 */
class Repository {
    /**
     * Create a new Repository instance.
     *
     * @param path  The root path of the repository.
     */
    constructor(path, gitRevision, repoLinks) {
        /**
         * A list of all files tracked by the repository.
         */
        this.files = [];
        /**
         * The hostname for this GitHub/Bitbucket/.etc project.
         *
         * Defaults to: `github.com` (for normal, public GitHub instance projects)
         *
         * Can be the hostname for an enterprise version of GitHub, e.g. `github.acme.com`
         * (if found as a match in the list of git remotes).
         */
        this.hostname = "github.com";
        /**
         * Whether this is a GitHub, Bitbucket, or other type of repository.
         */
        this.type = models_1.RepositoryType.GitHub;
        this.urlCache = new Map();
        this.path = path;
        this.branch = gitRevision || "master";
        for (let i = 0, c = repoLinks.length; i < c; i++) {
            let match = /(github(?!.us)(?:\.[a-z]+)*\.[a-z]{2,})[:/]([^/]+)\/(.*)/.exec(repoLinks[i]);
            // Github Enterprise
            if (!match) {
                match = /(\w+\.githubprivate.com)[:/]([^/]+)\/(.*)/.exec(repoLinks[i]);
            }
            // Github Enterprise
            if (!match) {
                match = /(\w+\.ghe.com)[:/]([^/]+)\/(.*)/.exec(repoLinks[i]);
            }
            // Github Enterprise
            if (!match) {
                match = /(\w+\.github.us)[:/]([^/]+)\/(.*)/.exec(repoLinks[i]);
            }
            if (!match) {
                match = /(bitbucket.org)[:/]([^/]+)\/(.*)/.exec(repoLinks[i]);
            }
            if (!match) {
                match = /(gitlab.com)[:/]([^/]+)\/(.*)/.exec(repoLinks[i]);
            }
            if (match) {
                this.hostname = match[1];
                this.user = match[2];
                this.project = match[3];
                if (this.project.endsWith(".git")) {
                    this.project = this.project.slice(0, -4);
                }
                break;
            }
        }
        if (this.hostname.includes("bitbucket.org")) {
            this.type = models_1.RepositoryType.Bitbucket;
        }
        else if (this.hostname.includes("gitlab.com")) {
            this.type = models_1.RepositoryType.GitLab;
        }
        else {
            this.type = models_1.RepositoryType.GitHub;
        }
        let out = git("-C", path, "ls-files");
        if (out.status === 0) {
            out.stdout.split("\n").forEach((file) => {
                if (file !== "") {
                    this.files.push(base_path_1.BasePath.normalize(path + "/" + file));
                }
            });
        }
        if (!gitRevision) {
            out = git("-C", path, "rev-parse", "--short", "HEAD");
            if (out.status === 0) {
                this.branch = out.stdout.replace("\n", "");
            }
        }
    }
    /**
     * Check whether the given file is tracked by this repository.
     *
     * @param fileName  The name of the file to test for.
     * @returns TRUE when the file is part of the repository, otherwise FALSE.
     */
    contains(fileName) {
        return this.files.includes(fileName);
    }
    /**
     * Get the URL of the given file on GitHub or Bitbucket.
     *
     * @param fileName  The file whose URL should be determined.
     * @returns A URL pointing to the web preview of the given file or undefined.
     */
    getURL(fileName) {
        if (this.urlCache.has(fileName)) {
            return this.urlCache.get(fileName);
        }
        if (!this.user || !this.project || !this.contains(fileName)) {
            return;
        }
        const url = [
            `https://${this.hostname}`,
            this.user,
            this.project,
            this.type === models_1.RepositoryType.GitLab ? "-" : undefined,
            this.type === models_1.RepositoryType.Bitbucket ? "src" : "blob",
            this.branch,
            fileName.substring(this.path.length + 1),
        ]
            .filter((s) => !!s)
            .join("/");
        this.urlCache.set(fileName, url);
        return url;
    }
    getLineNumberAnchor(lineNumber) {
        switch (this.type) {
            default:
            case models_1.RepositoryType.GitHub:
            case models_1.RepositoryType.GitLab:
                return "L" + lineNumber;
            case models_1.RepositoryType.Bitbucket:
                return "lines-" + lineNumber;
        }
    }
    /**
     * Try to create a new repository instance.
     *
     * Checks whether the given path is the root of a valid repository and if so
     * creates a new instance of {@link Repository}.
     *
     * @param path  The potential repository root.
     * @returns A new instance of {@link Repository} or undefined.
     */
    static tryCreateRepository(path, gitRevision, gitRemote) {
        const out = git("-C", path, "rev-parse", "--show-toplevel");
        const remotesOutput = git("-C", path, "remote", "get-url", gitRemote);
        if (out.status !== 0 || remotesOutput.status !== 0) {
            return;
        }
        return new Repository(base_path_1.BasePath.normalize(out.stdout.replace("\n", "")), gitRevision, remotesOutput.stdout.split("\n"));
    }
}
exports.Repository = Repository;
