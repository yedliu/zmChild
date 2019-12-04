import bridge from 'utils/bridge';

export function goAbilityTest(learnAbilityTestUrl) {
  bridge.callhandler('learnAbility', { learnAbilityTestUrl });
}

export function nativeGoBack() {
  console.log('native exit');
  bridge.callhandler('exit');
}

export function nativeGetGift() {
  bridge.callhandler('getFreeCourse');
}

export function nativeShowPage() {
  bridge.callhandler('loadFinish');
}
