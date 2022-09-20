import { gid_t } from "./sys/types";

// int initgroups(const char *user, gid_t group);
export const initgroups = (user:string, group:gid_t) => 0;