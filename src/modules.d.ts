declare namespace NodeJS {
  export interface ProcessEnv {
    FINAL_DATE?: string;
    GCP_BUCKET: string;
    OUTPUT_CSV?: string;
  }
}
