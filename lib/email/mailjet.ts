import Mailjet from 'node-mailjet'

const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY || '',
    process.env.MAILJET_SECRET_KEY || ''
)

interface ContactProperties {
    name: string
    company?: string
    role?: string
    primary_interest?: string
    source: string
    topic_business_automation?: boolean
    topic_ai_trends?: boolean
    topic_ai_education?: boolean
    frequency?: string
}

interface MailjetResponse {
    Data: Array<{
        ID: number
        [key: string]: unknown
    }>
    [key: string]: unknown
}

export async function addContactToList(
    email: string,
    properties: ContactProperties
) {
    try {
        // First, create or update the contact
        const contactRequest = await mailjet
            .post('contact', { version: 'v3' })
            .request({
                IsExcludedFromCampaigns: false,
                Email: email,
                Name: properties.name,
            })

        // Update contact properties for segmentation
        const body = contactRequest.body as unknown as MailjetResponse
        const contactId = body.Data[0].ID

        await mailjet
            .put('contactdata', { version: 'v3' })
            .id(contactId)
            .request({
                Data: [
                    { Name: 'company', Value: properties.company || '' },
                    { Name: 'role', Value: properties.role || '' },
                    { Name: 'primary_interest', Value: properties.primary_interest || '' },
                    { Name: 'source', Value: properties.source },
                    { Name: 'topic_business_automation', Value: properties.topic_business_automation ? 'true' : 'false' },
                    { Name: 'topic_ai_trends', Value: properties.topic_ai_trends ? 'true' : 'false' },
                    { Name: 'topic_ai_education', Value: properties.topic_ai_education ? 'true' : 'false' },
                    { Name: 'frequency', Value: properties.frequency || 'weekly' },
                ],
            })

        return { success: true, contactId }
    } catch (error) {
        console.error('Mailjet error:', error)
        return { success: false, error }
    }
}

export async function updateContactProperties(
    email: string,
    properties: Partial<ContactProperties>
) {
    try {
        // Find the contact first
        const contactRequest = await mailjet
            .get('contact', { version: 'v3' })
            .request({
                Email: email,
            })

        const body = contactRequest.body as unknown as MailjetResponse
        if (!body.Data || body.Data.length === 0) {
            return { success: false, error: 'Contact not found' }
        }

        const contactId = body.Data[0].ID

        const dataToUpdate = []
        if (properties.company !== undefined) {
            dataToUpdate.push({ Name: 'company', Value: properties.company })
        }
        if (properties.role !== undefined) {
            dataToUpdate.push({ Name: 'role', Value: properties.role })
        }
        if (properties.topic_business_automation !== undefined) {
            dataToUpdate.push({ Name: 'topic_business_automation', Value: properties.topic_business_automation ? 'true' : 'false' })
        }
        if (properties.topic_ai_trends !== undefined) {
            dataToUpdate.push({ Name: 'topic_ai_trends', Value: properties.topic_ai_trends ? 'true' : 'false' })
        }
        if (properties.topic_ai_education !== undefined) {
            dataToUpdate.push({ Name: 'topic_ai_education', Value: properties.topic_ai_education ? 'true' : 'false' })
        }
        if (properties.frequency !== undefined) {
            dataToUpdate.push({ Name: 'frequency', Value: properties.frequency })
        }

        await mailjet
            .put('contactdata', { version: 'v3' })
            .id(contactId)
            .request({
                Data: dataToUpdate,
            })

        return { success: true, contactId }
    } catch (error) {
        console.error('Mailjet error:', error)
        return { success: false, error }
    }
}

export async function removeContactFromList(email: string) {
    try {
        const contactRequest = await mailjet
            .get('contact', { version: 'v3' })
            .request({
                Email: email,
            })

        const body = contactRequest.body as unknown as MailjetResponse
        if (!body.Data || body.Data.length === 0) {
            return { success: false, error: 'Contact not found' }
        }

        const contactId = body.Data[0].ID

        await mailjet
            .put('contact', { version: 'v3' })
            .id(contactId)
            .request({
                IsExcludedFromCampaigns: true,
            })

        return { success: true }
    } catch (error) {
        console.error('Mailjet error:', error)
        return { success: false, error }
    }
}

export function determineContactLists(primaryInterest?: string): string[] {
    // You can customize this logic based on your Mailjet list structure
    const lists = ['main_list'] // Everyone goes to main list

    if (primaryInterest === 'entrepreneur' || primaryInterest === 'business_owner') {
        lists.push('entrepreneurs')
    }
    if (primaryInterest === 'developer') {
        lists.push('developers')
    }
    if (primaryInterest === 'education') {
        lists.push('educators')
    }

    return lists
}
