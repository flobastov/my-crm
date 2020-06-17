declare var M;

export class MateialService {
  static toast(message: string) {
    M.toast({html: message});
  }
}
