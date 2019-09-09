export class IgnoreUnauthorizedRegex {
    public ignoreUnthorizedPathRequestManyId(reqPath: string, arrRegex: string[]): boolean {
        for(let position of arrRegex) {
            const objectRegex = new RegExp(position);
            if (objectRegex.test(reqPath)) {
                return true;
            }
        }
        return false;
    }
}