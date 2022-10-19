declare namespace NodeJS {
  export interface ProcessEnv {
    /**
     * Name of the storage bucket in Google Cloud Storage
     */
    GCS_BUCKET: string;
    /**
     * Whether to output balances in CSV format, in addition to JSON.
     *
     * Case-insensitive
     */
    OUTPUT_CSV?: string;
    /**
     * The final date that records should be fetched for.
     *
     * Optional
     */
    RECORD_FINAL_DATE?: string;
  }
}
