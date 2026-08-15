import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Đã được inject bởi AuthGuard trước đó

    if (!user || !user.uid) {
      throw new ForbiddenException('Yêu cầu xác thực tài khoản');
    }

    try {
      // Truy vấn tài liệu người dùng trong bộ sưu tập 'users' ở Firestore
      const userDoc = await this.firebaseService.db().collection('users').doc(user.uid).get();
      
      if (!userDoc.exists) {
        throw new ForbiddenException('Thông tin người dùng không tồn tại trên cơ sở dữ liệu');
      }

      const userData = userDoc.data();
      if (!userData || userData.role !== 'admin') {
        throw new ForbiddenException('Quyền truy cập bị từ chối. Chỉ dành cho Admin.');
      }

      return true;
    } catch (error) {
      throw new ForbiddenException('Lỗi xác thực quyền Admin: ' + error.message);
    }
  }
}
