// Mock Data for BTXH Frontend Development
// This file contains sample data for UI development before API integration

export const MOCK_USERS = [
    {
        id: 1,
        email: 'admin@btxh.vn',
        fullName: 'Nguyễn Văn Admin',
        role: 'admin',
        phone: '0123456789',
        createdAt: '2024-01-01T00:00:00Z',
        isActive: true,
    },
    {
        id: 2,
        email: 'sender1@btxh.vn',
        fullName: 'Trần Thị Gửi',
        role: 'sender',
        phone: '0987654321',
        createdAt: '2024-01-15T00:00:00Z',
        isActive: true,
    },
    {
        id: 3,
        email: 'adopter1@btxh.vn',
        fullName: 'Lê Văn Nhận',
        role: 'adopter',
        phone: '0912345678',
        createdAt: '2024-02-01T00:00:00Z',
        isActive: true,
    },
    {
        id: 4,
        email: 'staff_reception@btxh.vn',
        fullName: 'Phạm Thị Tiếp',
        role: 'staff_reception',
        phone: '0934567890',
        createdAt: '2024-01-20T00:00:00Z',
        isActive: true,
    },
    {
        id: 5,
        email: 'staff_adoption@btxh.vn',
        fullName: 'Hoàng Văn Nuôi',
        role: 'staff_adoption',
        phone: '0945678901',
        createdAt: '2024-01-25T00:00:00Z',
        isActive: true,
    },
    {
        id: 6,
        email: 'manager@btxh.vn',
        fullName: 'Đỗ Thị Quản',
        role: 'manager',
        phone: '0956789012',
        createdAt: '2024-01-10T00:00:00Z',
        isActive: true,
    },
];

export const MOCK_CHILDREN = [
    {
        id: 1,
        name: 'Nguyễn Minh Anh',
        birthDate: '2020-05-15',
        gender: 'female',
        healthStatus: 'Tốt',
        specialNeeds: false,
        description: 'Bé gái ngoan ngoãn, thích hát hò',
        status: 'available',
        createdAt: '2024-03-01T00:00:00Z',
        updatedAt: '2024-03-01T00:00:00Z',
        senderId: 2,
        senderName: 'Trần Thị Gửi',
        documents: [
            { id: 1, name: 'Giấy khai sinh', url: '/docs/birth-cert-1.pdf' },
            { id: 2, name: 'Giấy khám sức khỏe', url: '/docs/health-cert-1.pdf' },
        ],
    },
    {
        id: 2,
        name: 'Trần Văn Đức',
        birthDate: '2019-08-20',
        gender: 'male',
        healthStatus: 'Khỏe mạnh',
        specialNeeds: false,
        description: 'Bé trai năng động, thích thể thao',
        status: 'available',
        createdAt: '2024-02-15T00:00:00Z',
        updatedAt: '2024-02-15T00:00:00Z',
        senderId: 2,
        senderName: 'Trần Thị Gửi',
        documents: [
            { id: 3, name: 'Giấy khai sinh', url: '/docs/birth-cert-2.pdf' },
        ],
    },
    {
        id: 3,
        name: 'Lê Thị Mai',
        birthDate: '2021-12-10',
        gender: 'female',
        healthStatus: 'Cần theo dõi',
        specialNeeds: true,
        description: 'Bé gái cần chăm sóc đặc biệt',
        status: 'pending',
        createdAt: '2024-03-10T00:00:00Z',
        updatedAt: '2024-03-10T00:00:00Z',
        senderId: 2,
        senderName: 'Trần Thị Gửi',
        documents: [],
    },
];

export const MOCK_ADOPTIONS = [
    {
        id: 1,
        adopterId: 3,
        adopterName: 'Lê Văn Nhận',
        childId: 1,
        childName: 'Nguyễn Minh Anh',
        status: 'pending',
        reason: 'Gia đình tôi có điều kiện tốt để nuôi dạy con',
        documents: [
            { id: 1, name: 'CMND/CCCD', url: '/docs/id-card-1.pdf' },
            { id: 2, name: 'Giấy kết hôn', url: '/docs/marriage-cert-1.pdf' },
            { id: 3, name: 'Giấy xác nhận thu nhập', url: '/docs/income-cert-1.pdf' },
        ],
        createdAt: '2024-03-05T00:00:00Z',
        updatedAt: '2024-03-05T00:00:00Z',
    },
    {
        id: 2,
        adopterId: 3,
        adopterName: 'Lê Văn Nhận',
        childId: 2,
        childName: 'Trần Văn Đức',
        status: 'approved',
        reason: 'Chúng tôi rất yêu trẻ em và muốn tạo môi trường tốt',
        documents: [
            { id: 4, name: 'CMND/CCCD', url: '/docs/id-card-2.pdf' },
            { id: 5, name: 'Giấy xác nhận thu nhập', url: '/docs/income-cert-2.pdf' },
        ],
        createdAt: '2024-02-20T00:00:00Z',
        updatedAt: '2024-03-01T00:00:00Z',
        approvedAt: '2024-03-01T00:00:00Z',
        approvedBy: 'Hoàng Văn Nuôi',
    },
    {
        id: 3,
        adopterId: 3,
        adopterName: 'Lê Văn Nhận',
        childId: null,
        childName: 'Lê Thị Mai',
        status: 'missing_info',
        reason: 'Gia đình chúng tôi sẵn sàng nhận nuôi',
        note: 'Cần bổ sung giấy khám sức khỏe định kỳ',
        documents: [
            { id: 6, name: 'CMND/CCCD', url: '/docs/id-card-3.pdf' },
        ],
        createdAt: '2024-03-12T00:00:00Z',
        updatedAt: '2024-03-15T00:00:00Z',
    },
];

export const MOCK_RECEPTIONS = [
    {
        id: 1,
        senderId: 2,
        senderName: 'Trần Thị Gửi',
        childName: 'Nguyễn Minh Anh',
        childBirthDate: '2020-05-15',
        relationship: 'Bà ngoại',
        reason: 'Không có điều kiện nuôi dưỡng',
        status: 'approved',
        documents: [
            { id: 1, name: 'Giấy khai sinh', url: '/docs/birth-cert-1.pdf' },
            { id: 2, name: 'Giấy khám sức khỏe', url: '/docs/health-cert-1.pdf' },
            { id: 3, name: 'CMND người gửi', url: '/docs/sender-id-1.pdf' },
        ],
        createdAt: '2024-03-01T00:00:00Z',
        updatedAt: '2024-03-02T00:00:00Z',
        approvedAt: '2024-03-02T00:00:00Z',
        approvedBy: 'Phạm Thị Tiếp',
    },
    {
        id: 2,
        senderId: 2,
        senderName: 'Trần Thị Gửi',
        childName: 'Trần Văn Đức',
        childBirthDate: '2019-08-20',
        relationship: 'Ông ngoại',
        reason: 'Hoàn cảnh gia đình khó khăn',
        status: 'pending',
        documents: [
            { id: 4, name: 'Giấy khai sinh', url: '/docs/birth-cert-2.pdf' },
            { id: 5, name: 'CMND người gửi', url: '/docs/sender-id-2.pdf' },
        ],
        createdAt: '2024-02-15T00:00:00Z',
        updatedAt: '2024-02-15T00:00:00Z',
    },
    {
        id: 3,
        senderId: 2,
        senderName: 'Trần Thị Gửi',
        childName: 'Lê Thị Mai',
        childBirthDate: '2021-12-10',
        relationship: 'Bà nội',
        reason: 'Không đủ sức khỏe để nuôi con',
        status: 'rejected',
        reasonReject: 'Thiếu giấy tờ cần thiết',
        documents: [],
        createdAt: '2024-03-10T00:00:00Z',
        updatedAt: '2024-03-12T00:00:00Z',
        rejectedAt: '2024-03-12T00:00:00Z',
        rejectedBy: 'Phạm Thị Tiếp',
    },
];

export const MOCK_STATS = {
    totalUsers: 45,
    totalChildren: 12,
    totalAdoptions: 8,
    pendingRequests: 15,
    approvedRequests: 23,
    rejectedRequests: 4,
    monthlyStats: [
        { month: '2024-01', adoptions: 2, receptions: 3 },
        { month: '2024-02', adoptions: 3, receptions: 4 },
        { month: '2024-03', adoptions: 3, receptions: 5 },
    ],
};

// Utility functions for mock API
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiResponse = (data, delayMs = 300) => {
    return delay(delayMs).then(() => Promise.resolve(data));
};

export const mockApiError = (message = 'Mock API Error', delayMs = 300) => {
    return delay(delayMs).then(() => Promise.reject(new Error(message)));
};