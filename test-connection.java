import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class TestConnection {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://postgres:Vinitsahare%4051@db.hzjxivfpagutsbomeduz.supabase.co:5432/postgres";
        String username = "postgres";
        String password = "Vinitsahare@51";
        
        try {
            System.out.println("Testing database connection...");
            Connection conn = DriverManager.getConnection(url, username, password);
            System.out.println("✅ Database connection successful!");
            conn.close();
        } catch (SQLException e) {
            System.out.println("❌ Database connection failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
