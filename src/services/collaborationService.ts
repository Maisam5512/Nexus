import apiService from "./api"
import { API_ENDPOINTS } from "./api-config"

export interface CreateCollaborationRequestData {
  entrepreneurId: string
  investorId: string
  requestType: "investment" | "mentorship" | "partnership" | "advisory"
  message: string
  proposedAmount?: string
  proposedTerms?: string
}

export interface CollaborationFilters {
  status?: "pending" | "accepted" | "rejected" | "withdrawn" | "expired"
  type?: "sent" | "received"
  investorId?: string
  entrepreneurId?: string
  page?: number
  limit?: number
}

class CollaborationService {
  // Create collaboration request - FIXED: Added proper error handling
  async createRequest(data: CreateCollaborationRequestData): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await apiService.post(API_ENDPOINTS.COLLABORATIONS.REQUEST, data)
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error("Failed to create collaboration request:", error)
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to create collaboration request" 
      }
    }
  }

  // Get collaboration requests
  async getCollaborationRequests(filters: CollaborationFilters = {}) {
    try {
      const response = await apiService.get(API_ENDPOINTS.COLLABORATIONS.REQUESTS, {
        params: filters,
      })
      
      // Handle different response formats
      if (response.data && Array.isArray(response.data)) {
        return { success: true, data: response.data }
      } else if (response.data && response.data.requests) {
        return { success: true, data: response.data.requests }
      } else if (response.data && response.data.data) {
        return { success: true, data: response.data.data }
      } else {
        return { success: false, data: [], error: "Invalid response format" }
      }
    } catch (error: any) {
      console.error("Failed to get collaboration requests:", error)
      return { 
        success: false, 
        data: [], 
        error: error.response?.data?.message || "Failed to fetch collaboration requests" 
      }
    }
  }

  // Update collaboration request
  async updateCollaborationRequest(requestId: string, updates: Partial<{ status: string }>) {
    try {
      const response = await apiService.put(`/collaborations/${requestId}`, updates)
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error("Failed to update collaboration request:", error)
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to update collaboration request" 
      }
    }
  }

  // Accept collaboration request
  async acceptRequest(requestId: string, responseMessage?: string) {
    try {
      const response = await apiService.put(API_ENDPOINTS.COLLABORATIONS.ACCEPT(requestId), {
        responseMessage,
      })
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error("Failed to accept request:", error)
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to accept request" 
      }
    }
  }

  // Reject collaboration request
  async rejectRequest(requestId: string, responseMessage?: string) {
    try {
      const response = await apiService.put(API_ENDPOINTS.COLLABORATIONS.REJECT(requestId), {
        responseMessage,
      })
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error("Failed to reject request:", error)
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to reject request" 
      }
    }
  }

  // Get requests sent by a specific investor
  async getRequestsFromInvestor(investorId: string) {
    const res = await this.getCollaborationRequests({ type: "sent", investorId })
    return res.data || []
  }
}

const collaborationService = new CollaborationService()
export { collaborationService }
export default collaborationService


