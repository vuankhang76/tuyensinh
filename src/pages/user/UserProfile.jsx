import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Building2,
  Edit,
  Save,
  X,
  Camera,
  Check,
  Clock,
  Globe,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { userService } from '@/services';
import ChangePasswordModal from '@/components/user/ChangePasswordModal';

const UserProfile = () => {
  const { user: contextUser, updateUser } = useAuth();
  const [localUser, setLocalUser] = useState(contextUser);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [editData, setEditData] = useState({
    displayName: '',
    username: '',
    email: ''
  });

  const user = localUser || contextUser;

  useEffect(() => {
    if (contextUser) {
      setLocalUser(contextUser);
    }
  }, [contextUser]);

  useEffect(() => {
    if (user) {
      setEditData({
        displayName: user.displayName || '',
        username: user.username || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      displayName: user.displayName || '',
      username: user.username || '',
      email: user.email || ''
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await userService.updateUser(user.id, editData);
      
      const updatedUser = {
        ...user,
        ...editData
      };
      
      userService.updateCurrentUser(updatedUser);
      
      setLocalUser(updatedUser);
      
      if (updateUser) {
        updateUser(updatedUser);
      }
      
      toast.success('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRoleBadge = (role) => {
    const configs = {
      admin: { variant: 'destructive', label: 'Quản trị viên', icon: Shield },
      university: { variant: 'default', label: 'Trường đại học', icon: Building2 },
      student: { variant: 'secondary', label: 'Sinh viên', icon: User }
    };
    return configs[role] || configs.student;
  };

  const getProviderBadge = (provider) => {
    const configs = {
      google: { variant: 'outline', label: 'Google', color: 'text-blue-600' },
      email: { variant: 'outline', label: 'Email', color: 'text-gray-600' },
      firebase: { variant: 'outline', label: 'Firebase', color: 'text-orange-600' }
    };
    return configs[provider];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có thông tin';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Ngày không hợp lệ';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Không tìm thấy thông tin người dùng</h2>
          <p className="text-muted-foreground">Vui lòng đăng nhập để xem thông tin cá nhân.</p>
        </div>
      </div>
    );
  }

  const roleConfig = getRoleBadge(user.role);
  const providerConfig = getProviderBadge(user.provider);
  const RoleIcon = roleConfig.icon;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Thông tin cá nhân</h1>
          <p className="text-muted-foreground mt-2">Quản lý thông tin tài khoản của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="relative mx-auto">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={user?.photoURL} alt={user.displayName} />
                    <AvatarFallback className="text-lg">
                      {user.email?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0"
                    onClick={() => toast.info('Chức năng thay đổi ảnh đại diện đang phát triển')}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="mt-4">
                  {user.displayName || user.email}
                  <span className="text-sm text-muted-foreground ml-2">#{user.id}</span>
                </CardTitle>
                <CardDescription className="flex items-center justify-center gap-2">
                  <RoleIcon className="h-4 w-4" />
                  <Badge variant={roleConfig.variant}>{roleConfig.label}</Badge>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Email Verification Status */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Email</span>
                  </div>
                  {user.emailVerified ? (
                    <Badge variant="secondary" className="text-green-600">
                      <Check className="h-3 w-3 mr-1" />
                      Đã xác minh
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-orange-600">
                      <Clock className="h-3 w-3 mr-1" />
                      Chờ xác minh
                    </Badge>
                  )}
                </div>

                {/* Provider */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Phương thức</span>
                  </div>
                  <Badge variant={providerConfig.variant} className={providerConfig.color}>
                    {providerConfig.label}
                  </Badge>
                </div>

                {/* University (if applicable) */}
                {user.universityId && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Trường đại học</span>
                    </div>
                    <p className="text-sm font-medium">ID: {user.universityId}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2">
                  {user.provider == 'email' && (  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowChangePasswordModal(true)}
                    disabled={user.provider !== 'email'}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Đổi mật khẩu
                  </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Thông tin chi tiết</CardTitle>
                  <CardDescription>Thông tin tài khoản và cài đặt</CardDescription>
                </div>
                {!isEditing ? (
                  <Button variant="outline" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel} disabled={loading}>
                      <X className="h-4 w-4 mr-2" />
                      Hủy
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Display Name */}
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Tên hiển thị</Label>
                      {isEditing ? (
                        <Input
                          id="displayName"
                          value={editData.displayName}
                          onChange={(e) => handleInputChange('displayName', e.target.value)}
                          pattern={/^[^\s]+$/}
                          title="Tên hiển thị không được chứa khoảng trắng"
                        />
                      ) : (
                        <Input
                          id="displayName"
                          value={user.displayName || 'Chưa thiết lập'}
                          disabled
                        />
                      )}
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                      <p className="text-sm bg-muted p-3 rounded-md">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Account Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Thông tin tài khoản</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Created At */}
                    <div className="space-y-2">
                      <Label>Ngày tạo tài khoản</Label>
                      <div className="flex items-center gap-2 text-sm bg-muted p-3 rounded-md">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(user.createdAt)}
                      </div>
                    </div>

                    {/* Last Login */}
                    <div className="space-y-2">
                      <Label>Đăng nhập gần nhất</Label>
                      <div className="flex items-center gap-2 text-sm bg-muted p-3 rounded-md">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {formatDate(user.lastLoginAt)}
                      </div>
                    </div>

                    {/* Firebase UID */}
                    {user.firebaseUid && (
                      <div className="space-y-2 md:col-span-2">
                        <Label>Firebase UID</Label>
                        <p className="text-sm bg-muted p-3 rounded-md text-muted-foreground font-mono">
                          {user.firebaseUid}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Change Password Modal */}
        <ChangePasswordModal
          isOpen={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
        />
      </div>
    </div>
  );
};

export default UserProfile; 