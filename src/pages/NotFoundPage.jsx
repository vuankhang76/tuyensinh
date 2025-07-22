import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Newspaper, School, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NotFoundPageNoCard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <div>
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">404</h1>
            <p className="text-lg text-muted-foreground">
              Oops! Trang bạn tìm không tồn tại.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
            <p className="text-muted-foreground">
                Có vẻ bạn đã đi lạc. Hãy thử tìm kiếm thông tin trường hoặc ngành học bên dưới.
            </p>
            <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
                <Input 
                type="text" 
                placeholder="Tìm kiếm tên trường, ngành học..." 
                className="flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" aria-label="Tìm kiếm">
                <Search className="h-4 w-4" />
                </Button>
            </form>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild variant="outline">
            <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Về Trang chủ
            </Link>
            </Button>
            <Button asChild variant="outline">
            <Link to="/danh-sach-truong-dai-hoc">
                <School className="mr-2 h-4 w-4" />
                Danh sách trường
            </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}