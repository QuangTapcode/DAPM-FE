import { MOCK_CHILDREN, mockApiResponse, mockApiError } from './mockData';

const childApi = {
  getAll: async (params = {}) => {
    let filteredChildren = [...MOCK_CHILDREN];

    // Filter by status
    if (params.status) {
      filteredChildren = filteredChildren.filter(c => c.status === params.status);
    }

    // Filter by sender (for sender role)
    if (params.senderId) {
      filteredChildren = filteredChildren.filter(c => c.senderId === parseInt(params.senderId));
    }

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedChildren = filteredChildren.slice(startIndex, endIndex);

    return mockApiResponse({
      items: paginatedChildren,
      total: filteredChildren.length,
      page,
      limit,
      totalPages: Math.ceil(filteredChildren.length / limit),
    });
  },

  getById: async (id) => {
    const child = MOCK_CHILDREN.find(c => c.id === parseInt(id));
    if (!child) {
      return mockApiError('Child not found');
    }
    return mockApiResponse(child);
  },

  create: async (data) => {
    const newChild = {
      id: MOCK_CHILDREN.length + 1,
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: [],
    };

    // Add to mock data (in real app, this would be persisted)
    MOCK_CHILDREN.push(newChild);

    return mockApiResponse(newChild);
  },

  update: async (id, data) => {
    const childIndex = MOCK_CHILDREN.findIndex(c => c.id === parseInt(id));
    if (childIndex === -1) {
      return mockApiError('Child not found');
    }

    MOCK_CHILDREN[childIndex] = {
      ...MOCK_CHILDREN[childIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return mockApiResponse(MOCK_CHILDREN[childIndex]);
  },

  delete: async (id) => {
    const childIndex = MOCK_CHILDREN.findIndex(c => c.id === parseInt(id));
    if (childIndex === -1) {
      return mockApiError('Child not found');
    }

    MOCK_CHILDREN.splice(childIndex, 1);
    return mockApiResponse({ success: true });
  },

  uploadDocument: async (id, formData) => {
    const child = MOCK_CHILDREN.find(c => c.id === parseInt(id));
    if (!child) {
      return mockApiError('Child not found');
    }

    // Mock document upload
    const newDoc = {
      id: Date.now(),
      name: formData.get('name') || 'Document',
      url: `/docs/mock-${Date.now()}.pdf`,
    };

    child.documents.push(newDoc);
    return mockApiResponse(newDoc);
  },
};

export default childApi;
