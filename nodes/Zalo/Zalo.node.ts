/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class Zalo implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Zalo API',
        name: 'zaloApi',
        icon: 'file:Zalo_logo.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Giao tiếp với Zalo API',
        defaults: {
            name: 'Zalo',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'zaloApi',
                required: true,
            },
        ],
        requestDefaults: {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    { name: 'User Info', value: 'userInfo' },
                    { name: 'Message', value: 'message' },
                ],
                default: 'userInfo',
            },
            ///
            {
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: { resource: ['userInfo'] },
				},
				options: [
					{
						name: 'Get User Info',
						value: 'get',
						routing: {
							request: {
								method: 'GET',
								url: 'https://graph.zalo.me/v2.0/me',
								headers: {
									'access_token': '={{$credentials.access_token}}',
								},
								qs: {
									fields: 'id,name,picture',
								},
							},
						},
						action: 'Get user info',
					},
				],
				default: 'get',
			},
            ///
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: { resource: ['message'] },
                },
                options: [
                    {
                        name: 'Get Messages',
                        value: 'getMessages',
                        routing: {
                            request: {
                                method: 'GET',
                                url: 'https://openapi.zalo.me/v2.0/oa/listrecentchat',
                                headers: {
                                    'access_token': '={{$credentials.access_token}}',
                                },
                                qs: {
                                    data: '={{JSON.stringify({ offset: $parameter.offset || 0, count: $parameter.count || 5 })}}',
                                },
                            },
                        },
                        action: 'Get messages',
                    },
                    {
                        name: 'Send Text Message',
                        value: 'sendMessage',
                        routing: {
                            request: {
                                method: 'POST',
                                url: 'https://openapi.zalo.me/v2.0/oa/message',
                                headers: {
                                    'access_token': '={{$credentials.access_token}}',
                                },
                                body: {
                                    recipient: {
                                        anonymous_id: '={{$parameter.anonymousId}}',
                                        conversation_id: '={{$parameter.conversationId}}',
                                    },
                                    message: {
                                        text: '={{$parameter.messageText}}',
                                    },
                                },
                            },
                        },
                        action: 'Send a text message',
                    },
                    {
                        displayName: 'Send File Message',
                        name: 'Send File Message', // Thêm thuộc tính name
                        value: 'send File Message',
                        routing: {
                            request: {
                                method: 'POST',
                                url: 'https://openapi.zalo.me/v2.0/oa/message',
                                headers: {
                                    'access_token': '={{$credentials.access_token}}',
                                },
                                body: {
                                    recipient: {
                                        anonymous_id: '={{$parameter.anonymousId}}',
                                        conversation_id: '={{$parameter.conversationId}}',
                                    },
                                    message: {
                                        attachment: {
                                            type: 'file',
                                            payload: {
                                                token: '={{$parameter.fileToken}}', // Token đã được trả về khi upload file
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        action: 'Send a file message',
                    },
                    {
                        displayName: 'Send Sticker',
                        name: 'Send Sticker', // Thêm thuộc tính name
                        value: 'send Sticker',
                        routing: {
                            request: {
                                method: 'POST',
                                url: 'https://openapi.zalo.me/v2.0/oa/message',
                                headers: {
                                    'access_token': '={{$credentials.access_token}}',
                                },
                                body: {
                                    recipient: {
                                        anonymous_id: '={{$parameter.anonymousId}}',
                                        conversation_id: '={{$parameter.conversationId}}',
                                    },
                                    message: {
                                        attachment: {
                                            type: 'template',
                                            payload: {
                                                template_type: 'media',
                                                elements: [
                                                    {
                                                        media_type: 'sticker',
                                                        attachment_id: '={{$parameter.attachmentId}}',
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        action: 'Send a sticker',
                    },
                ],
                default: 'getMessages',
            },
            {
                displayName: 'Offset',
                name: 'offset',
                type: 'number',
                default: 0,
                displayOptions: {
                    show: { resource: ['message'], operation: ['getMessages'] },
                },
            },
            {
                displayName: 'Count',
                name: 'count',
                type: 'number',
                default: 5,
                displayOptions: {
                    show: { resource: ['message'], operation: ['getMessages'] },
                },
            },
            {
                displayName: 'Anonymous ID',
                name: 'anonymousId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: { resource: ['message'], operation: ['sendMessage', 'sendFileMessage', 'sendSticker'] },
                },
                description: 'The anonymous ID of the recipient',
            },
            {
                displayName: 'Conversation ID',
                name: 'conversationId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: { resource: ['message'], operation: ['sendMessage', 'sendFileMessage', 'sendSticker'] },
                },
                description: 'The conversation ID for the recipient',
            },
            {
                displayName: 'Message Text',
                name: 'messageText',
                type: 'string',
                default: '',
                displayOptions: {
                    show: { resource: ['message'], operation: ['sendMessage'] },
                },
                description: 'The text of the message to send',
            },
            {
                displayName: 'File Token',
                name: 'fileToken',
                type: 'string',
				typeOptions: { password: true },
                default: '',
                displayOptions: {
                    show: { resource: ['message'], operation: ['sendFileMessage'] },
                },
                description: 'The token of the file to send as a message attachment',
            },
            {
                displayName: 'Attachment ID',
                name: 'attachmentId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: { resource: ['message'], operation: ['sendSticker'] },
                },
                description: 'The attachment ID of the sticker to send',
            },
        ],
    };
}

