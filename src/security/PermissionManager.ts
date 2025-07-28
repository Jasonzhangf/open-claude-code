export interface PermissionRequest {
  userId: string;
  resource: string;
  action: string;
  context?: Record<string, any>;
}

export interface PermissionResponse {
  granted: boolean;
  reason?: string;
}

export interface PermissionManager {
  checkPermission(request: PermissionRequest): Promise<PermissionResponse>;
  addRule(rule: (request: PermissionRequest) => Promise<PermissionResponse>): void;
}

export class SimplePermissionManager implements PermissionManager {
  private rules: ((request: PermissionRequest) => Promise<PermissionResponse>)[] = [];

  async checkPermission(request: PermissionRequest): Promise<PermissionResponse> {
    // Check all rules in order, deny if any rule denies
    for (const rule of this.rules) {
      const result = await rule(request);
      if (!result.granted) {
        return result;
      }
    }
    // Default allow if no rules deny
    return { granted: true };
  }

  addRule(rule: (request: PermissionRequest) => Promise<PermissionResponse>): void {
    this.rules.push(rule);
  }
}
