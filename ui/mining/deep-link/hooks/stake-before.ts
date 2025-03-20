import { contractRegisterH, contractUnregisterH } from '../../../mymachine/modules/api/index';

export const useStakeBefore = () => {
  // 质押之前注册
  const registerH = async () => {
    const res = await contractRegisterH();
    console.log(res, 'MMMMMMM');
  };

  // 质押之前注销
  const unregister = async () => {
    const res = await contractUnregisterH();
    console.log(res, 'MMMMMMM');
  };
  return {
    registerH,
    unregister,
  };
};
