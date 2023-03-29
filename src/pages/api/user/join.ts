import type { NextApiRequest, NextApiResponse } from 'next';

interface RequestType {
  name: string;
  imageUrl: string;
}

interface ResponseType {
  isSuccess: boolean;
  code: number;
  message: string;
  result: {
    jwt?: string;
  };
}

type ResponseCode = 1000 | 2000 | 2001 | 2002 | 4000 | 4001;

const responseStatus = {
  1000: '성공적으로 회원가입 되었습니다',
  2000: '이름은 1~20자로 입력해야 합니다.',
  2001: '이름은 한글,영어,숫자만 포함 가능합니다.',
  2002: 'ImageUrl 값이 비어있습니다.',
  4000: '서버가 원활하지 않습니다.',
  4001: '데이터베이스 일시적 오류',
};

function checkNameLength(name: string): boolean {
  // 1~20자인지 체크
  if (name.length > 0 && name.length <= 20) {
    return true;
  } else {
    return false;
  }
}

function checkNameType(name: string): boolean {
  // 한글,영어,숫자만 포함 가능
  const regex = /^[가-힣a-zA-Z0-9]*$/;
  if (regex.test(name)) {
    return true;
  } else {
    return false;
  }
}

function makeResponseByCode(code: ResponseCode, jwt?: string): ResponseType {
  if (code === 1000 && jwt) {
    return {
      isSuccess: true,
      code,
      message: responseStatus[code],
      result: { jwt },
    };
  } else {
    return {
      isSuccess: false,
      code,
      message: responseStatus[code],
      result: {},
    };
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { name, imageUrl }: RequestType = req.body;
  if (!checkNameLength(name)) {
    return res.json(makeResponseByCode(2000));
  }
  if (!checkNameType(name)) {
    return res.json(makeResponseByCode(2001));
  }
  if (!imageUrl) {
    return res.json(makeResponseByCode(2002));
  }
}
