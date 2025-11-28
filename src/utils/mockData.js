export const mockApplications = [{
  id: '1',
  name: 'John Smith',
  email: 'john.smith@email.com',
  phone: '+44 7700 900123',
  dateApplied: '2024-01-15',
  status: 'new',
  address: '123 High Street, London, SW1A 1AA',
  rightToWork: 'yes',
  drivingLicence: 'Full UK Licence',
  physicalActivity: 'yes',
  shiftAcceptance: 'yes',
  availability: 'Immediate',
  preferredLocation: 'London',
  emergencyContact: 'Jane Smith - 07700 900456',
  cv: 'john_smith_cv.pdf',
  coverLetter: 'john_smith_cover.pdf'
}, {
  id: '2',
  name: 'Sarah Johnson',
  email: 'sarah.j@email.com',
  phone: '+44 7700 900456',
  dateApplied: '2024-01-14',
  status: 'reviewed',
  address: '456 Park Lane, Manchester, M1 1AA',
  rightToWork: 'yes',
  drivingLicence: 'Full UK Licence',
  physicalActivity: 'yes',
  shiftAcceptance: 'yes',
  availability: '2 weeks notice',
  preferredLocation: 'Manchester',
  emergencyContact: 'Mike Johnson - 07700 900789',
  cv: 'sarah_johnson_cv.pdf',
  coverLetter: 'sarah_johnson_cover.pdf'
}];
export const mockEmployers = [{
  id: '1',
  companyName: 'Tech Solutions Ltd',
  contactPerson: 'David Brown',
  email: 'david@techsolutions.com',
  phone: '+44 20 7946 0958',
  roleTitle: 'Software Engineer',
  dateSubmitted: '2024-01-16',
  status: 'new',
  jobDescription: 'Looking for experienced software engineers to join our growing team.',
  hiresNeeded: 3,
  budget: '£45,000 - £65,000',
  jdFile: 'tech_solutions_jd.pdf',
  notes: ''
}, {
  id: '2',
  companyName: 'Retail Corp',
  contactPerson: 'Emma Wilson',
  email: 'emma@retailcorp.com',
  phone: '+44 20 7946 0123',
  roleTitle: 'Store Manager',
  dateSubmitted: '2024-01-15',
  status: 'contacted',
  jobDescription: 'Seeking experienced store managers for multiple locations.',
  hiresNeeded: 5,
  budget: '£30,000 - £40,000',
  jdFile: 'retail_corp_jd.pdf',
  notes: 'Spoke with Emma on 16/01 - very interested'
}];
export const mockCandidates = [{
  id: '1',
  name: 'Michael Chen',
  email: 'michael.chen@email.com',
  phone: '+44 7700 900321',
  dateRegistered: '2024-01-10',
  skills: 'Project Management, Team Leadership, Agile',
  desiredRole: 'Project Manager',
  experience: '8 years in project management',
  cv: 'michael_chen_cv.pdf',
  tag: 'potential'
}, {
  id: '2',
  name: 'Lisa Anderson',
  email: 'lisa.a@email.com',
  phone: '+44 7700 900654',
  dateRegistered: '2024-01-12',
  skills: 'Customer Service, Sales, Communication',
  desiredRole: 'Customer Service Manager',
  experience: '5 years in customer service',
  cv: 'lisa_anderson_cv.pdf',
  tag: 'potential'
}];
export const mockContactMessages = [{
  id: '1',
  name: 'Robert Taylor',
  email: 'robert.t@email.com',
  subject: 'Partnership Inquiry',
  date: '2024-01-17',
  message: 'Hi, I would like to discuss a potential partnership opportunity with Verqin Ltd. Please contact me at your earliest convenience.',
  status: 'new'
}, {
  id: '2',
  name: 'Jennifer Lee',
  email: 'jennifer.lee@email.com',
  subject: 'General Question',
  date: '2024-01-16',
  message: 'I have a question about your services. Could you provide more information about your recruitment process?',
  status: 'resolved'
}];
export const mockDashboardStats = {
  totalApplications: 45,
  totalEmployers: 0,
  totalCandidates: 0,
  totalContactMessages: 0,
  recentActivity: [{
    id: '1',
    type: 'application',
    message: 'New application from John Smith',
    time: '2 hours ago'
  }, {
    id: '2',
    type: 'employer',
    message: 'Tech Solutions Ltd submitted hiring request',
    time: '5 hours ago'
  }, {
    id: '3',
    type: 'candidate',
    message: 'Michael Chen registered as candidate',
    time: '1 day ago'
  }, {
    id: '4',
    type: 'contact',
    message: 'New contact message from Robert Taylor',
    time: '1 day ago'
  }, {
    id: '5',
    type: 'application',
    message: 'Sarah Johnson application reviewed',
    time: '2 days ago'
  }],
  applicationsChart: [{
    date: '2024-01-10',
    count: 0
  }, {
    date: '2024-01-11',
    count: 0
  }, {
    date: '2024-01-12',
    count: 0
  }, {
    date: '2024-01-13',
    count: 0
  }, {
    date: '2024-01-14',
    count: 0
  }, {
    date: '2024-01-15',
    count: 0
  }, {
    date: '2024-01-16',
    count: 0
  }],
  topRoles: [
  //   {
  //   role: 'Software Engineer',
  //   count: 12
  // }, {
  //   role: 'Store Manager',
  //   count: 8
  // }, {
  //   role: 'Customer Service',
  //   count: 7
  // }, {
  //   role: 'Project Manager',
  //   count: 6
  // }, {
  //   role: 'Sales Executive',
  //   count: 5
  // }
]
};