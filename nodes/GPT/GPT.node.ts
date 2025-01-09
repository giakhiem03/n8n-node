/* eslint-disable n8n-nodes-base/node-class-description-name-miscased */
/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class GPT implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ChatGPT API',
		name: 'GPT',
		icon: 'file:GPT_logo.svg', // Thay thế với logo của OpenAI
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Giao tiếp với API ChatGPT của OpenAI',
		defaults: {
			name: 'ChatGPT',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				// eslint-disable-next-line n8n-nodes-base/node-class-description-credentials-name-unsuffixed
				name: 'GPT', // Đảm bảo bạn đã định nghĩa credential này
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.openai.com/v1',
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
					{ name: 'Chat', value: 'chat' },
				],
				default: 'chat',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: { resource: ['chat'] },
				},
				options: [
					{
						name: 'Send Message',
						value: 'sendMessage',
						action: 'Send a message to chat gpt',
						routing: {
							request: {
								method: 'POST',
								url: '/chat/completions',
							},
						},
					},
				],
				default: 'sendMessage',
			},
			{
				displayName: 'Message',
				description: 'Tin nhắn của người dùng gửi tới ChatGPT',
				required: true,
				name: 'userMessage',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['chat'],
						operation: ['sendMessage'],
					},
				},
				default: '', // Giữ giá trị mặc định trống
			},
			{
				displayName: 'Model',
                description: 'Mô hình mà bạn muốn sử dụng',
                required: true,
                name: 'model',
                type: 'options',  // Thay đổi từ 'string' thành 'options'
                options: [  // Thêm mảng options cho người dùng chọn
                    {
                        name: 'GPT-3.5',
                        value: 'gpt-3.5-turbo',
                    },
                    {
                        name: 'GPT-4',
                        value: 'gpt-4',
                    },
                    {
                        name: 'GPT-4o-Mini',
                        value: 'gpt-4o-mini',
                    },
                ],
                displayOptions: {
                    show: {
                        resource: ['chat'],
                        operation: ['sendMessage'],
                    },
                },
                default: 'gpt-3.5-turbo', // Giá trị mặc định

			},
		],
	};
}
