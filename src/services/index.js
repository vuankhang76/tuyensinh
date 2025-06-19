// Services index file - Export all services for easy importing

// Authentication
export { default as authService } from './authService'

// Core entities
export { default as universityService } from './universityService'
export { default as userService } from './userService'
export { default as majorService } from './majorService'
export { default as scholarshipService } from './scholarshipService'

// Academic
export { default as academicProgramService } from './academicProgramService'
export { default as admissionMethodService } from './admissionMethodService'
export { default as admissionCriteriaService } from './admissionCriteriaService'
export { default as admissionScoreService } from './admissionScoreService'

// News and content
export { default as admissionNewsService } from './admissionNewsService'

// Chat functionality
export { default as chatService } from './chatService'

// Create a combined services object for convenience
export const services = {
  auth: authService,
  university: universityService,
  user: userService,
  major: majorService,
  scholarship: scholarshipService,
  academicProgram: academicProgramService,
  admissionMethod: admissionMethodService,
  admissionCriteria: admissionCriteriaService,
  admissionScore: admissionScoreService,
  admissionNews: admissionNewsService,
  chat: chatService
}

export default services 