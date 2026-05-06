function hasValue(value) {
    return value !== undefined && value !== null && String(value).trim() !== '';
}

function getFirstValue(user, keys) {
    for (const key of keys) {
        if (hasValue(user?.[key])) {
            return user[key];
        }
    }

    return '';
}

export function getMissingAdopterProfileFields(user) {
    if (!user) return ['Thông tin tài khoản'];

    const requiredFields = [
        {
            label: 'Họ và tên',
            keys: ['fullName', 'displayName', 'name'],
        },
        {
            label: 'Số CCCD',
            keys: ['nationalId', 'cccd', 'identityNumber'],
        },
        {
            label: 'Giới tính',
            keys: ['gender'],
        },
        {
            label: 'Ngày sinh',
            keys: ['dateOfBirth', 'birthDate', 'dob'],
        },
        {
            label: 'Số điện thoại',
            keys: ['phone', 'phoneNumber'],
        },
        {
            label: 'Email',
            keys: ['email'],
        },
        {
            label: 'Tỉnh / Thành phố',
            keys: ['provinceName', 'provinceCode', 'province'],
        },
        {
            label: 'Phường / Xã / Quận',
            keys: ['wardName', 'wardCode', 'ward', 'districtName', 'districtCode'],
        },
        {
            label: 'Địa chỉ cụ thể',
            keys: ['addressDetail', 'address', 'specificAddress'],
        },
    ];

    return requiredFields
        .filter((field) => !hasValue(getFirstValue(user, field.keys)))
        .map((field) => field.label);
}

export function isAdopterProfileComplete(user) {
    return getMissingAdopterProfileFields(user).length === 0;
}