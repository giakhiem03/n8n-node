/* eslint-disable n8n-nodes-base/cred-class-name-unsuffixed */
/* eslint-disable n8n-nodes-base/cred-class-field-name-uppercase-first-char */
/* eslint-disable n8n-nodes-base/cred-filename-against-convention */
import {
    ICredentialType,
    INodeProperties,
    IAuthenticateGeneric,
} from 'n8n-workflow';

export class GPT implements ICredentialType {
    // eslint-disable-next-line n8n-nodes-base/cred-class-field-name-unsuffixed
    name = 'GPT';
    displayName = 'OpenAI API';
    documentationUrl = 'https://platform.openai.com/docs/overview';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            required: true,
            description: 'API key for OpenAI API',
            default: '',
        },
    ];
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: 'Bearer {{$credentials.apiKey}}',
            },
        },
    };
}
