export interface MoodleProfileDefinition {
  name: string;
  url: string;
  backend: 'auto' | 'core' | 'moodlia';
  credentials: {
    core: { token_env: string } | null;
    moodlia: { token_env: string } | null;
  };
  allow_insecure: boolean;
}

export function parseProfiles(document: unknown): Map<string, MoodleProfileDefinition>;
export function loadProfiles(configPath: string): Map<string, MoodleProfileDefinition>;
export function resolveProfile(
  profiles: Map<string, MoodleProfileDefinition>,
  name: string,
  environment?: Record<string, string | undefined>
): MoodleProfileDefinition & { credentials: Record<string, { token: string }> };
export function describeProfile(profile: MoodleProfileDefinition): {
  name: string;
  url: string;
  backend: string;
  credential_providers: string[];
};
