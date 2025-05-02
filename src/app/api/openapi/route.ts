import { NextResponse } from 'next/server';

// Inline the OpenAPI specification directly to avoid file system access issues
export async function GET() {
  // Get API base URL from environment variables (set in wrangler.jsonc)
  const apiBaseUrl = process.env.API_BASE_URL || '/api';
  
  // Define the OpenAPI spec directly as a JavaScript object (JSON) instead of YAML
  const openApiSpec = {
    openapi: "3.1.0",
    info: {
      title: "Virgin Money API",
      description: "Virgin Money Banking API provides secure access to financial data and operations.\n\n**Security Note:** All endpoints except `/api/user-profile` (GET) require an API key for authentication.",
      version: "1.0.0",
      contact: {
        name: "Virgin Money API Support",
        email: "api-support@virginmoney.example"
      }
    },
    servers: [
      {
        url: apiBaseUrl,
        description: "Virgin Money API Server"
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "api-key"
        }
      },
      schemas: {
        Account: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "acc-001"
            },
            name: {
              type: "string",
              example: "Current Account"
            },
            balance: {
              type: "number",
              format: "float",
              example: 2567.89
            },
            currency: {
              type: "string",
              example: "GBP"
            }
          },
          required: ["id", "name", "balance", "currency"]
        },
        Transaction: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "tx-001"
            },
            accountId: {
              type: "string",
              example: "acc-001"
            },
            amount: {
              type: "number",
              format: "float",
              example: -45.99
            },
            description: {
              type: "string",
              example: "Supermarket"
            },
            date: {
              type: "string",
              format: "date",
              example: "2025-04-28"
            }
          },
          required: ["id", "accountId", "amount", "date"]
        },
        UserProfile: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "user-001"
            },
            name: {
              type: "string",
              example: "John Smith"
            },
            email: {
              type: "string",
              format: "email",
              example: "john.smith@example.com"
            },
            phone: {
              type: "string",
              example: "+44 7012 345678"
            },
            address: {
              type: "string",
              example: "123 High Street, London, UK"
            },
            preferences: {
              type: "object",
              properties: {
                notifications: {
                  type: "boolean",
                  example: true
                },
                marketingEmail: {
                  type: "boolean",
                  example: false
                }
              }
            }
          },
          required: ["id", "name", "email"]
        },
        PaymentMethod: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "pm-001"
            },
            type: {
              type: "string",
              enum: ["Card", "Direct Debit"],
              example: "Card"
            },
            last4: {
              type: "string",
              example: "1234"
            },
            expiry: {
              type: "string",
              example: "05/27"
            }
          },
          required: ["id", "type"]
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Unauthorized"
            },
            message: {
              type: "string",
              example: "Invalid or missing API key"
            }
          },
          required: ["error", "message"]
        }
      }
    },
    paths: {
      "/accounts": {
        get: {
          summary: "List all accounts",
          description: "Retrieves a list of all accounts for the authenticated user.",
          security: [{ ApiKeyAuth: [] }],
          responses: {
            "200": {
              description: "A list of accounts",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Account"
                    }
                  }
                }
              }
            },
            "403": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        },
        post: {
          summary: "Create a new account",
          description: "Creates a new account with the specified details.",
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      example: "New Savings Account"
                    }
                  },
                  required: ["name"]
                }
              }
            }
          },
          responses: {
            "201": {
              description: "Account created successfully",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/Account" },
                      {
                        type: "object",
                        properties: {
                          status: {
                            type: "string",
                            example: "created"
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            },
            "403": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        },
        put: {
          summary: "Update an account",
          description: "Updates an existing account with the specified details.",
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      example: "acc-001"
                    },
                    name: {
                      type: "string",
                      example: "Updated Account Name"
                    }
                  },
                  required: ["id"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Account updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Account updated successfully"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        },
        patch: {
          summary: "Partially update an account",
          description: "Updates specific fields of an existing account.",
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      example: "acc-001"
                    },
                    name: {
                      type: "string",
                      example: "Updated Account Name"
                    }
                  },
                  required: ["id"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Account partially updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Account partially updated successfully"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        },
        delete: {
          summary: "Delete an account",
          description: "Deletes the specified account.",
          security: [{ ApiKeyAuth: [] }],
          responses: {
            "200": {
              description: "Account deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Account deleted successfully"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      },
      "/transactions": {
        get: {
          summary: "List all transactions",
          description: "Retrieves a list of all transactions for the authenticated user.",
          security: [{ ApiKeyAuth: [] }],
          responses: {
            "200": {
              description: "A list of transactions",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Transaction"
                    }
                  }
                }
              }
            },
            "403": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        },
        post: {
          summary: "Create a new transaction",
          description: "Creates a new transaction with the specified details.",
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    accountId: {
                      type: "string",
                      example: "acc-001"
                    },
                    amount: {
                      type: "number",
                      format: "float",
                      example: -45.99
                    },
                    description: {
                      type: "string",
                      example: "Supermarket"
                    }
                  },
                  required: ["accountId", "amount"]
                }
              }
            }
          },
          responses: {
            "201": {
              description: "Transaction created successfully",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/Transaction" },
                      {
                        type: "object",
                        properties: {
                          status: {
                            type: "string",
                            example: "processed"
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            },
            "403": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        },
        put: {
          summary: "Update a transaction",
          description: "Updates an existing transaction with the specified details.",
          security: [{ ApiKeyAuth: [] }],
          responses: {
            "200": {
              description: "Transaction updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Transaction updated successfully"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        },
        patch: {
          summary: "Partially update a transaction",
          description: "Updates specific fields of an existing transaction.",
          security: [{ ApiKeyAuth: [] }],
          responses: {
            "200": {
              description: "Transaction partially updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Transaction partially updated successfully"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        },
        delete: {
          summary: "Delete a transaction",
          description: "Deletes the specified transaction.",
          security: [{ ApiKeyAuth: [] }],
          responses: {
            "200": {
              description: "Transaction deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Transaction deleted successfully"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      },
      "/user-profile": {
        get: {
          summary: "Get user profile",
          description: "Retrieves the profile information for the current user.\n\n**Security Note:** This endpoint can be accessed without an API key, which is a potential security vulnerability.",
          responses: {
            "200": {
              description: "User profile information",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/UserProfile"
                  }
                }
              }
            }
          }
        },
        post: {
          summary: "Create a user profile",
          description: "Creates a new user profile with the specified details.",
          security: [{ ApiKeyAuth: [] }],
          responses: {
            "201": {
              description: "User profile created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "User profile created successfully"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        },
        put: {
          summary: "Update user profile",
          description: "Updates the user profile with the specified details.",
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      example: "John Smith"
                    },
                    email: {
                      type: "string",
                      format: "email",
                      example: "john.smith@example.com"
                    }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "User profile updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        example: "user-001"
                      },
                      name: {
                        type: "string",
                        example: "John Smith"
                      },
                      email: {
                        type: "string",
                        example: "john.smith@example.com"
                      },
                      message: {
                        type: "string",
                        example: "Profile updated successfully"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        },
        patch: {
          summary: "Partially update user profile",
          description: "Updates specific fields of the user profile.",
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      example: "John Smith"
                    },
                    email: {
                      type: "string",
                      format: "email",
                      example: "john.smith@example.com"
                    }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "User profile partially updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        example: "user-001"
                      },
                      name: {
                        type: "string",
                        example: "John Smith"
                      },
                      email: {
                        type: "string",
                        example: "john.smith@example.com"
                      },
                      message: {
                        type: "string",
                        example: "Profile partially updated successfully"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        },
        delete: {
          summary: "Delete user profile",
          description: "Deletes the user profile.",
          security: [{ ApiKeyAuth: [] }],
          responses: {
            "200": {
              description: "User profile deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "User profile deleted successfully"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      },
      "/payment-methods": {
        get: {
          summary: "List all payment methods",
          description: "Retrieves a list of all payment methods for the authenticated user.",
          security: [{ ApiKeyAuth: [] }],
          responses: {
            "200": {
              description: "A list of payment methods",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/PaymentMethod"
                    }
                  }
                }
              }
            },
            "403": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        },
        post: {
          summary: "Add a new payment method",
          description: "Adds a new payment method with the specified details.",
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["Card", "Direct Debit"],
                      example: "Card"
                    },
                    last4: {
                      type: "string",
                      example: "5678"
                    },
                    expiry: {
                      type: "string",
                      example: "09/26"
                    }
                  },
                  required: ["type"]
                }
              }
            }
          },
          responses: {
            "201": {
              description: "Payment method added successfully",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/PaymentMethod" },
                      {
                        type: "object",
                        properties: {
                          status: {
                            type: "string",
                            example: "added"
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            },
            "403": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        },
        put: {
          summary: "Update a payment method",
          description: "Updates an existing payment method with the specified details.",
          security: [{ ApiKeyAuth: [] }],
          responses: {
            "200": {
              description: "Payment method updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Payment method updated successfully"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        },
        patch: {
          summary: "Partially update a payment method",
          description: "Updates specific fields of an existing payment method.",
          security: [{ ApiKeyAuth: [] }],
          responses: {
            "200": {
              description: "Payment method partially updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Payment method partially updated successfully"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        },
        delete: {
          summary: "Delete a payment method",
          description: "Deletes the specified payment method.",
          security: [{ ApiKeyAuth: [] }],
          responses: {
            "200": {
              description: "Payment method deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Payment method deleted successfully"
                      }
                    }
                  }
                }
              }
            },
            "403": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  // Return the OpenAPI spec as JSON with appropriate headers and filename
  return new NextResponse(JSON.stringify(openApiSpec, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="openapi.json"',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
