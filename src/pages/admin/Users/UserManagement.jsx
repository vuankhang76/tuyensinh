import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from 'sonner';
import { userService } from '@/services/userService';
import { useDebounce } from '@/hooks/useDebounce';

import {
  Plus,
  Edit,
  Trash2,
  Shield,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw
} from 'lucide-react';

const UserManagement = () => {
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || 'all');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [editForm, setEditForm] = useState({
    displayName: '',
    email: '',
    role: '',
    photoURL: '',
    emailVerified: false
  });

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response);
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setSearchLoading(true);
    }
  }, [searchTerm, debouncedSearchTerm]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) {
      params.set('q', debouncedSearchTerm);
    }
    if (roleFilter !== 'all') {
      params.set('role', roleFilter);
    }
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    setSearchParams(params, { replace: true });
  }, [debouncedSearchTerm, roleFilter, currentPage, setSearchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, roleFilter]);


  useEffect(() => {
    setSearchLoading(true);
    let filtered = users;
    if (debouncedSearchTerm) {
      filtered = filtered.filter(user =>
        user.displayName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    setFilteredUsers(filtered);
    setCurrentPage(1);
    setSearchLoading(false);
  }, [users, debouncedSearchTerm, roleFilter]);

  const getRoleBadge = (role) => {
    const variants = {
      admin: 'destructive',
      university: 'default',
      student: 'secondary'
    };
    const labels = {
      admin: 'Quản trị',
      university: 'Trường ĐH',
      student: 'Sinh viên'
    };
    return { variant: variants[role] || 'outline', label: labels[role] || 'Không xác định' };
  };

  const handleRoleChange = (userId, newRole) => {
    const currentUser = users.find(u => u.id === userId);
    if (!currentUser || currentUser.role === newRole) return;
    setConfirmAction('role');
    setConfirmData({ user: currentUser, newRole });
    setConfirmDialogOpen(true);
  };

  const handleConfirmRoleChange = async () => {
    const { user, newRole } = confirmData;
    const body = { role: newRole };
    try {
      await userService.updateUserByAdmin(user.id, body);
      setUsers(users.map(u =>
        u.id === user.id ? { ...u, role: newRole } : u
      ));
      toast.success(`Đã thay đổi vai trò thành ${newRole === 'admin' ? 'Quản trị' : newRole === 'university' ? 'Trường ĐH' : 'Sinh viên'}`);
    } catch (error) {
      toast.error(`Có lỗi xảy ra khi cập nhật vai trò: ${error.response?.data?.message || error.message}`);
    } finally {
      setConfirmDialogOpen(false);
      setConfirmAction(null);
      setConfirmData(null);
    }
  };

  const handleEditClick = (user) => {
    setUserToEdit(user);
    setEditForm({
      displayName: user.displayName || '',
      photoURL: user.photoURL || "",
      emailVerified: user.emailVerified ?? false,
      role: user.role,
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = () => {
    setConfirmAction('edit');
    setConfirmData({ user: userToEdit, displayName: editForm.displayName });
    setConfirmDialogOpen(true);
  };

  const handleConfirmEdit = async () => {
    const { user, displayName } = confirmData;
    try {
      const body = { displayName };
      await userService.updateUserByAdmin(user.id, body);
      setUsers(users.map(u =>
        u.id === user.id ? { ...u, displayName } : u
      ));
      toast.success('Cập nhật tên hiển thị thành công');
      setEditDialogOpen(false);
      setUserToEdit(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật');
    } finally {
      setConfirmDialogOpen(false);
      setConfirmAction(null);
      setConfirmData(null);
    }
  };

  const handleVerify = (user) => {
    setConfirmAction('verify');
    setConfirmData({ user });
    setConfirmDialogOpen(true);
  };

  const handleConfirmVerify = async () => {
    const { user } = confirmData;
    try {
      const body = { emailVerified: true };
      await userService.updateUserByAdmin(user.id, body);
      setUsers(users.map(u =>
        u.id === user.id ? { ...u, emailVerified: true } : u
      ));
      toast.success('Đã xác minh người dùng thành công');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xác minh');
    } finally {
      setConfirmDialogOpen(false);
      setConfirmAction(null);
      setConfirmData(null);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await userService.deleteUser(userToDelete.id);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      toast.success('Đã xóa người dùng thành công');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa người dùng');
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleAdd = () => {
    toast.info("Chức năng thêm người dùng mới sẽ được phát triển");
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setCurrentPage(1);
    setSearchLoading(false);
    fetchUsers();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa rõ';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (error) {
      return 'Chưa rõ';
    }
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => Number(a.id) - Number(b.id));
  const totalResults = sortedUsers.length;
  const totalPages = Math.ceil(totalResults / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

  const startResult = startIndex + 1;
  const endResult = Math.min(endIndex, totalResults);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Người dùng</h2>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button onClick={handleAdd} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          {searchLoading && (
            <RefreshCw className="absolute right-3 top-3 h-4 w-4 text-gray-400 animate-spin" />
          )}
          <Input
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 ${searchLoading ? 'pr-10' : ''}`}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Lọc theo vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            <SelectItem value="admin">Quản trị</SelectItem>
            <SelectItem value="university">Trường ĐH</SelectItem>
            <SelectItem value="student">Sinh viên</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] font-bold pl-4">ID</TableHead>
              <TableHead className="w-[240px] font-bold">Tên hiển thị</TableHead>
              <TableHead className="w-[240px] font-bold">Email</TableHead>
              <TableHead className="w-[120px] font-bold">Vai trò</TableHead>
              <TableHead className="w-[100px] font-bold text-center">Xác minh</TableHead>
              <TableHead className="w-[160px] font-bold">Ngày tạo</TableHead>
              <TableHead className="w-[160px] font-bold">Đăng nhập cuối</TableHead>
              <TableHead className="w-[120px] font-bold text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading || searchLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-8 bg-gray-200 rounded animate-pulse w-full"></div></TableCell>
                  <TableCell className="text-center"><div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse mx-auto"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  {debouncedSearchTerm || roleFilter !== 'all' ? 'Không tìm thấy người dùng nào' : 'Không có người dùng nào'}
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => {
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium max-w-15 pl-4">
                      <div className="truncate w-[80px]" title={user.id}>
                        {user.id}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-48">
                      <div className="truncate w-[180px]" title={user.displayName || 'Chưa cập nhật'}>
                        {user.displayName || 'Chưa cập nhật'}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-64">
                      <div className="truncate w-[200px]" title={user.email}>
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-[120px]" title={user.role === 'admin' ? 'Không thể thay đổi vai trò quản trị' : 'Nhấn để thay đổi vai trò'}>
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleRoleChange(user.id, value)}
                          disabled={user.role === 'admin'}
                        >
                          <SelectTrigger className={`w-full h-8 text-xs ${user.role === 'admin' ? 'cursor-not-allowed opacity-60' : ''}`}>
                            <SelectValue>
                              <span className={`${user.role === 'admin' ? 'text-red-600 font-medium' :
                                  user.role === 'university' ? 'text-blue-600 font-medium' :
                                    'text-gray-600 font-medium'
                                }`}>
                                {user.role === 'admin' ? 'Quản trị' :
                                  user.role === 'university' ? 'Trường ĐH' :
                                    'Sinh viên'}
                              </span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">
                              <span className="text-gray-600">Sinh viên</span>
                            </SelectItem>
                            <SelectItem value="university">
                              <span className="text-blue-600">Trường ĐH</span>
                            </SelectItem>
                            <SelectItem value="admin">
                              <span className="text-red-600">Quản trị</span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {user.emailVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>{user.lastLoginAt ? formatDate(user.lastLoginAt) : "Chưa đăng nhập"}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(user)}
                          title="Sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerify(user)}
                          disabled={user.emailVerified}
                          title="Xác minh"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        {user.role !== 'admin' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-600 hover:text-red-700"
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalResults > 0 && (
        <div className="flex items-center justify-between w-full py-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground w-110">
              Hiển thị {startResult}-{endResult} trên tổng {totalResults} kết quả
            </div>
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={currentPage === pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
            <div className="flex items-center gap-2 w-100">
              <span className="text-sm text-muted-foreground">Hiển thị:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-muted-foreground">mục/trang</span>
            </div>
          </div>
        </div>
      )}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa thông tin người dùng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin người dùng "{userToEdit?.displayName || 'Unkown'}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="displayName" className='mb-2'>Tên hiển thị</Label>
              <Input
                id="displayName"
                value={editForm.displayName}
                onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleEditSubmit}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận thao tác</DialogTitle>
            <DialogDescription>
              {confirmAction === 'role' && (
                <>
                  Bạn có chắc chắn muốn đổi vai trò người dùng "{confirmData?.user?.displayName}" thành <b>{confirmData?.newRole === 'admin' ? 'Quản trị' : confirmData?.newRole === 'university' ? 'Trường ĐH' : 'Sinh viên'}</b>?
                </>
              )}
              {confirmAction === 'verify' && (
                <>
                  Bạn có chắc chắn muốn xác minh người dùng "{confirmData?.user?.displayName}"?
                </>
              )}
              {confirmAction === 'edit' && (
                <>
                  Bạn có chắc chắn muốn đổi tên hiển thị thành "{confirmData?.displayName}" cho người dùng "{confirmData?.user?.displayName}"?
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setConfirmDialogOpen(false); setConfirmAction(null); setConfirmData(null); }}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmAction === 'role') handleConfirmRoleChange();
                if (confirmAction === 'verify') handleConfirmVerify();
                if (confirmAction === 'edit') handleConfirmEdit();
              }}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa người dùng "{userToDelete?.displayName}"?
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;