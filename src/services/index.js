// Import services
import universityService from './universityService'
import userService from './userService'
import majorService from './majorService'
import scholarshipService from './scholarshipService'
import academicProgramService from './academicProgramService'
import admissionMethodService from './admissionMethodService'
import admissionCriteriaService from './admissionCriteriaService'
import admissionScoreService from './admissionScoreService'
import admissionNewsService from './admissionNewsService'
import chatService from './chatService'

export { universityService }
export { userService }
export { majorService }
export { scholarshipService }
export { academicProgramService }
export { admissionMethodService }
export { admissionCriteriaService }
export { admissionScoreService }
export { admissionNewsService }
export { chatService }

export const services = {
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