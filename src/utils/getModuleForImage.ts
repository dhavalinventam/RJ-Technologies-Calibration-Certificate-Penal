export interface FileAttachmentConfig {
  uploadEndpoint: (recordId: string) => string
  deleteEndpoint: (recordId: string, attachmentId: string) => string
}

export const getModule = (module: string): FileAttachmentConfig => {
  const configs: Record<string, FileAttachmentConfig> = {
    project: {
      uploadEndpoint: id => `/tnt-project/${id}/project-attachment-pre-signed-url`,
      deleteEndpoint: (id, attachmentId) => `/tnt-project/${id}/attachments/${attachmentId}`
    },
    task: {
      uploadEndpoint: id => `/tnt-task/${id}/task-attachment-pre-signed-url`,
      deleteEndpoint: (id, attachmentId) => `/tnt-task/${id}/attachments/${attachmentId}`
    },
    contact: {
      uploadEndpoint: id => `/tnt-contact/${id}/contact-attachment-pre-signed-url`,
      deleteEndpoint: (id, attachmentId) => `/tnt-contact/${id}/attachments/${attachmentId}`
    },
    lead: {
      uploadEndpoint: id => `/tnt-lead/${id}/lead-attachment-pre-signed-url`,
      deleteEndpoint: (id, attachmentId) => `/tnt-lead/${id}/attachments/${attachmentId}`
    },
    product_service_master: {
      uploadEndpoint: id => `product-service-master/${id}/product-service-master-attachment-pre-signed-url`,
      deleteEndpoint: (id, attachmentId) => `/product-service-master/${id}/attachments/${attachmentId}`
    },
    product_variant: {
      uploadEndpoint: id => `product-variant/${id}/product-variant-attachment-pre-signed-url`,
      deleteEndpoint: (id, attachmentId) => `/product-variant/${id}/attachments/${attachmentId}`
    }
  }

  return configs[module]
}
