-- KODESK Sample Tasks Seed Data
-- This script populates the database with sample coding tasks

-- NOTE: We ensure each supported language has exactly 10 quests (level 1..10) and that each quest unlocks a single mini-game.

-- Python Tasks (levels 1..10)
INSERT INTO tasks (title, description, language, difficulty_level, level_number, prerequisite_task_id, test_cases, starter_code, solution_code) VALUES
('Hello World','Print "Hello, World!" to the console. This is your first Python program!','python','beginner',1,NULL,'[{"input":"","expected_output":"Hello, World!","is_hidden":false}]'::jsonb,'# Write your code here
print("Hello, World!")','print("Hello, World!")'),
('Add Two Numbers','Write a program that takes two numbers as input and prints their sum.','python','beginner',2,NULL,'[{"input":"5\n3","expected_output":"8","is_hidden":false},{"input":"10\n20","expected_output":"30","is_hidden":false},{"input":"-5\n5","expected_output":"0","is_hidden":false}]'::jsonb,'# Read two numbers and print their sum
a = int(input())
b = int(input())
# Your code here','a = int(input())
b = int(input())
print(a + b)'),
('Check Even or Odd','Write a program that checks if a number is even or odd.','python','beginner',3,NULL,'[{"input":"4","expected_output":"Even","is_hidden":false},{"input":"7","expected_output":"Odd","is_hidden":false},{"input":"0","expected_output":"Even","is_hidden":true}]'::jsonb,'# Check if a number is even or odd
n = int(input())
# Your code here','n = int(input())
if n % 2 == 0:
    print("Even")
else:
    print("Odd")'),
('Find Maximum','Write a program that finds the maximum of three numbers.','python','beginner',4,NULL,'[{"input":"5\n3\n9","expected_output":"9","is_hidden":false},{"input":"10\n20\n15","expected_output":"20","is_hidden":false},{"input":"-5\n-2\n-10","expected_output":"-2","is_hidden":true}]'::jsonb,'# Find maximum of three numbers
a = int(input())
b = int(input())
c = int(input())
# Your code here','a = int(input())
b = int(input())
c = int(input())
print(max(a, b, c))'),
('Calculate Factorial','Write a program to calculate the factorial of a number.','python','intermediate',5,NULL,'[{"input":"5","expected_output":"120","is_hidden":false},{"input":"0","expected_output":"1","is_hidden":false},{"input":"7","expected_output":"5040","is_hidden":true}]'::jsonb,'# Calculate factorial
n = int(input())
# Your code here','n = int(input())
fact = 1
for i in range(1, n + 1):
    fact *= i
print(fact)'),
('Check Prime Number','Write a program to check if a number is prime.','python','intermediate',6,NULL,'[{"input":"7","expected_output":"Prime","is_hidden":false},{"input":"10","expected_output":"Not Prime","is_hidden":false},{"input":"2","expected_output":"Prime","is_hidden":true}]'::jsonb,'# Check if number is prime
n = int(input())
# Your code here','n = int(input())
if n < 2:
    print("Not Prime")
else:
    is_prime = True
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            is_prime = False
            break
    print("Prime" if is_prime else "Not Prime")'),
('Reverse a String','Write a program to reverse a string.','python','beginner',7,NULL,'[{"input":"hello","expected_output":"olleh","is_hidden":false},{"input":"Python","expected_output":"nohtyP","is_hidden":false},{"input":"12345","expected_output":"54321","is_hidden":true}]'::jsonb,'# Reverse a string
s = input()
# Your code here','s = input()
print(s[::-1])'),
('Fibonacci Sequence','Write a program to print the first n numbers of the Fibonacci sequence.','python','intermediate',8,NULL,'[{"input":"5","expected_output":"0 1 1 2 3","is_hidden":false},{"input":"7","expected_output":"0 1 1 2 3 5 8","is_hidden":false},{"input":"10","expected_output":"0 1 1 2 3 5 8 13 21 34","is_hidden":true}]'::jsonb,'# Print first n Fibonacci numbers
n = int(input())
# Your code here','n = int(input())
a, b = 0, 1
result = []
for i in range(n):
    result.append(str(a))
    a, b = b, a + b
print(" ".join(result))'),
('List Comprehensions','Use a list comprehension to square numbers from 1..n and print them space-separated.','python','intermediate',9,NULL,'[{"input":"5","expected_output":"1 4 9 16 25","is_hidden":false},{"input":"3","expected_output":"1 4 9","is_hidden":true}]'::jsonb,'# List comprehensions
n = int(input())
# Your code here','n = int(input())
print(" ".join(str(i*i) for i in range(1, n+1)))'),
('File I/O Basics','Read lines from input and print them reversed (simple file I/O).','python','intermediate',10,NULL,'[{"input":"hello","expected_output":"olleh","is_hidden":false}]'::jsonb,'# File I/O basics
s = input()
# Your code here','s = input()
print(s[::-1])') ON CONFLICT (language, level_number) DO UPDATE SET
title = EXCLUDED.title,
description = EXCLUDED.description,
difficulty_level = EXCLUDED.difficulty_level,
prerequisite_task_id = EXCLUDED.prerequisite_task_id,
test_cases = EXCLUDED.test_cases,
starter_code = EXCLUDED.starter_code,
solution_code = EXCLUDED.solution_code;

-- Java Tasks (levels 1..10)
INSERT INTO tasks (title, description, language, difficulty_level, level_number, prerequisite_task_id, test_cases, starter_code, solution_code) VALUES
('Hello World','Print "Hello, World!" to the console. This is your first Java program!','java','beginner',1,NULL,'[{"input":"","expected_output":"Hello, World!","is_hidden":false}]'::jsonb,'public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n        System.out.println("Hello, World!");\n    }\n}','public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}'),
('Add Two Numbers','Write a program that takes two numbers as input and prints their sum.','java','beginner',2,NULL,'[{"input":"5\n3","expected_output":"8","is_hidden":false},{"input":"10\n20","expected_output":"30","is_hidden":false},{"input":"-5\n5","expected_output":"0","is_hidden":false}]'::jsonb,'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        // Your code here\n    }\n}','import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}'),
('Check Even or Odd','Write a program that checks if a number is even or odd.','java','beginner',3,NULL,'[{"input":"4","expected_output":"Even","is_hidden":false},{"input":"7","expected_output":"Odd","is_hidden":false},{"input":"0","expected_output":"Even","is_hidden":true}]'::jsonb,'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // Your code here\n    }\n}','import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        if (n % 2 == 0) {\n            System.out.println("Even");\n        } else {\n            System.out.println("Odd");\n        }\n    }\n}'),
('Find Maximum','Write a program that finds the maximum of three numbers.','java','beginner',4,NULL,'[{"input":"5\n3\n9","expected_output":"9","is_hidden":false},{"input":"10\n20\n15","expected_output":"20","is_hidden":false},{"input":"-5\n-2\n-10","expected_output":"-2","is_hidden":true}]'::jsonb,'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        int c = sc.nextInt();\n        // Your code here\n    }\n}','import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        int c = sc.nextInt();\n        int max = Math.max(a, Math.max(b, c));\n        System.out.println(max);\n    }\n}'),
('Calculate Factorial','Write a program to calculate the factorial of a number.','java','intermediate',5,NULL,'[{"input":"5","expected_output":"120","is_hidden":false},{"input":"0","expected_output":"1","is_hidden":false},{"input":"7","expected_output":"5040","is_hidden":true}]'::jsonb,'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // Your code here\n    }\n}','import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long fact = 1;\n        for (int i = 1; i <= n; i++) {\n            fact *= i;\n        }\n        System.out.println(fact);\n    }\n}'),
('String Reversal','Reverse a string input.','java','beginner',6,NULL,'[{"input":"hello","expected_output":"olleh","is_hidden":false}]'::jsonb,'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        // Your code here\n    }\n}','import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        System.out.println(new StringBuilder(s).reverse().toString());\n    }\n}'),
('Arrays and Loops','Print squares of numbers from 1..n separated by spaces.','java','intermediate',7,NULL,'[{"input":"5","expected_output":"1 4 9 16 25","is_hidden":false}]'::jsonb,'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // Your code here\n    }\n}','import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        StringBuilder sb = new StringBuilder();\n        for (int i=1;i<=n;i++) sb.append(i*i).append(i==n?"":" ");\n        System.out.println(sb.toString());\n    }\n}'),
('Basic I/O','Simple file I/O and string manipulation.','java','intermediate',8,NULL,'[{"input":"hello","expected_output":"olleh","is_hidden":false}]'::jsonb,'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        // Your code here\n    }\n}','import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        System.out.println(new StringBuilder(s).reverse().toString());\n    }\n}'),
('Collections Intro','Read N words and print them in the same order, space-separated.','java','intermediate',9,NULL,'[{"input":"3\njava\nis\nfun","expected_output":"java is fun","is_hidden":false},{"input":"4\na\nb\nc\nd","expected_output":"a b c d","is_hidden":true}]'::jsonb,'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // Your code here\n    }\n}','import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) {\n            String word = sc.next();\n            sb.append(word);\n            if (i < n - 1) sb.append(" ");\n        }\n        System.out.println(sb.toString());\n    }\n}'),
('Files and Streams','Read a line and print it reversed.','java','intermediate',10,NULL,'[{"input":"line1","expected_output":"1enil","is_hidden":false},{"input":"kodesk","expected_output":"ksedok","is_hidden":true}]'::jsonb,'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        // Your code here\n    }\n}','import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        System.out.println(new StringBuilder(s).reverse().toString());\n    }\n}') ON CONFLICT (language, level_number) DO UPDATE SET
title = EXCLUDED.title,
description = EXCLUDED.description,
difficulty_level = EXCLUDED.difficulty_level,
prerequisite_task_id = EXCLUDED.prerequisite_task_id,
test_cases = EXCLUDED.test_cases,
starter_code = EXCLUDED.starter_code,
solution_code = EXCLUDED.solution_code;

-- C++ Tasks (levels 1..10)
INSERT INTO tasks (title, description, language, difficulty_level, level_number, prerequisite_task_id, test_cases, starter_code, solution_code) VALUES
('Hello World','Print "Hello, World!" to the console. This is your first C++ program!','cpp','beginner',1,NULL,'[{"input":"","expected_output":"Hello, World!","is_hidden":false}]'::jsonb,'#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    cout << "Hello, World!" << endl;\n    return 0;\n}','#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}'),
('Add Two Numbers','Write a program that takes two numbers as input and prints their sum.','cpp','beginner',2,NULL,'[{"input":"5\n3","expected_output":"8","is_hidden":false},{"input":"10\n20","expected_output":"30","is_hidden":false},{"input":"-5\n5","expected_output":"0","is_hidden":false}]'::jsonb,'#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Your code here\n    return 0;\n}','#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n    return 0;\n}'),
('Check Even or Odd','Write a program that checks if a number is even or odd.','cpp','beginner',3,NULL,'[{"input":"4","expected_output":"Even","is_hidden":false},{"input":"7","expected_output":"Odd","is_hidden":false},{"input":"0","expected_output":"Even","is_hidden":true}]'::jsonb,'#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Your code here\n    return 0;\n}','#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    if (n % 2 == 0) {\n        cout << "Even" << endl;\n    } else {\n        cout << "Odd" << endl;\n    }\n    return 0;\n}'),
('Find Maximum','Write a program that finds the maximum of three numbers.','cpp','beginner',4,NULL,'[{"input":"5\n3\n9","expected_output":"9","is_hidden":false},{"input":"10\n20\n15","expected_output":"20","is_hidden":false},{"input":"-5\n-2\n-10","expected_output":"-2","is_hidden":true}]'::jsonb,'#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int a, b, c;\n    cin >> a >> b >> c;\n    // Your code here\n    return 0;\n}','#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int a, b, c;\n    cin >> a >> b >> c;\n    cout << max(a, max(b, c)) << endl;\n    return 0;\n}'),
('Calculate Factorial','Write a program to calculate the factorial of a number.','cpp','intermediate',5,NULL,'[{"input":"5","expected_output":"120","is_hidden":false},{"input":"0","expected_output":"1","is_hidden":false},{"input":"7","expected_output":"5040","is_hidden":true}]'::jsonb,'#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Your code here\n    return 0;\n}','#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    long long fact = 1;\n    for (int i = 1; i <= n; i++) {\n        fact *= i;\n    }\n    cout << fact << endl;\n    return 0;\n}'),
('Reverse a String','Reverse a string input.','cpp','beginner',6,NULL,'[{"input":"hello","expected_output":"olleh","is_hidden":false}]'::jsonb,'#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    // Your code here\n    return 0;\n}','#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    reverse(s.begin(), s.end());\n    cout << s << endl;\n    return 0;\n}'),
('Vectors and Loops','Print squares of numbers from 1..n separated by spaces.','cpp','intermediate',7,NULL,'[{"input":"5","expected_output":"1 4 9 16 25","is_hidden":false}]'::jsonb,'#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;cin >> n;\n    // Your code here\n    return 0;\n}','#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;cin >> n;\n    for (int i=1;i<=n;i++) cout << i*i << (i==n?"":" ");\n    cout << endl;\n    return 0;\n}'),
('File I/O Basics','Simple file I/O and string processing.','cpp','intermediate',8,NULL,'[{"input":"hello","expected_output":"olleh","is_hidden":false}]'::jsonb,'#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;getline(cin, s);\n    // Your code here\n    return 0;\n}','#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;getline(cin, s);\n    reverse(s.begin(), s.end());\n    cout << s << endl;\n    return 0;\n}'),
('STL Practice','Read N integers and print them in ascending order.','cpp','intermediate',9,NULL,'[{"input":"5\n5 1 4 2 3","expected_output":"1 2 3 4 5","is_hidden":false},{"input":"4\n10 -1 7 7","expected_output":"-1 7 7 10","is_hidden":true}]'::jsonb,'#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    // Your code here\n    return 0;\n}','#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    sort(nums.begin(), nums.end());\n    for (int i = 0; i < n; i++) cout << nums[i] << (i + 1 == n ? "" : " ");\n    cout << endl;\n    return 0;\n}'),
('Streams and Files','Read a line and print it reversed.','cpp','intermediate',10,NULL,'[{"input":"line1","expected_output":"1enil","is_hidden":false},{"input":"arcade","expected_output":"edacra","is_hidden":true}]'::jsonb,'#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    // Your code here\n    return 0;\n}','#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    reverse(s.begin(), s.end());\n    cout << s << endl;\n    return 0;\n}') ON CONFLICT (language, level_number) DO UPDATE SET
title = EXCLUDED.title,
description = EXCLUDED.description,
difficulty_level = EXCLUDED.difficulty_level,
prerequisite_task_id = EXCLUDED.prerequisite_task_id,
test_cases = EXCLUDED.test_cases,
starter_code = EXCLUDED.starter_code,
solution_code = EXCLUDED.solution_code;

-- Programmatically set prerequisite_task_id for each task: each level N (N>1) will have its prerequisite set to level N-1 for the same language
UPDATE tasks t
SET prerequisite_task_id = sub.prev_id
FROM (
  SELECT curr.id AS curr_id, prev.id AS prev_id
  FROM tasks curr
  JOIN tasks prev ON prev.language = curr.language AND prev.level_number = curr.level_number - 1
) AS sub
WHERE t.id = sub.curr_id;

-- Create a mini-game for each task (10 per language => 30 mini-games)
INSERT INTO games (title, description, level_number, game_type) VALUES
('Python Mini Game 1', 'Mini game for Python level 1', 1, 'mini'),
('Python Mini Game 2', 'Mini game for Python level 2', 2, 'mini'),
('Python Mini Game 3', 'Mini game for Python level 3', 3, 'mini'),
('Python Mini Game 4', 'Mini game for Python level 4', 4, 'mini'),
('Python Mini Game 5', 'Mini game for Python level 5', 5, 'mini'),
('Python Mini Game 6', 'Mini game for Python level 6', 6, 'mini'),
('Python Mini Game 7', 'Mini game for Python level 7', 7, 'mini'),
('Python Mini Game 8', 'Mini game for Python level 8', 8, 'mini'),
('Python Mini Game 9', 'Mini game for Python level 9', 9, 'mini'),
('Python Mini Game 10', 'Mini game for Python level 10', 10, 'mini'),
('Java Mini Game 1', 'Mini game for Java level 1', 1, 'mini'),
('Java Mini Game 2', 'Mini game for Java level 2', 2, 'mini'),
('Java Mini Game 3', 'Mini game for Java level 3', 3, 'mini'),
('Java Mini Game 4', 'Mini game for Java level 4', 4, 'mini'),
('Java Mini Game 5', 'Mini game for Java level 5', 5, 'mini'),
('Java Mini Game 6', 'Mini game for Java level 6', 6, 'mini'),
('Java Mini Game 7', 'Mini game for Java level 7', 7, 'mini'),
('Java Mini Game 8', 'Mini game for Java level 8', 8, 'mini'),
('Java Mini Game 9', 'Mini game for Java level 9', 9, 'mini'),
('Java Mini Game 10', 'Mini game for Java level 10', 10, 'mini'),
('C++ Mini Game 1', 'Mini game for C++ level 1', 1, 'mini'),
('C++ Mini Game 2', 'Mini game for C++ level 2', 2, 'mini'),
('C++ Mini Game 3', 'Mini game for C++ level 3', 3, 'mini'),
('C++ Mini Game 4', 'Mini game for C++ level 4', 4, 'mini'),
('C++ Mini Game 5', 'Mini game for C++ level 5', 5, 'mini'),
('C++ Mini Game 6', 'Mini game for C++ level 6', 6, 'mini'),
('C++ Mini Game 7', 'Mini game for C++ level 7', 7, 'mini'),
('C++ Mini Game 8', 'Mini game for C++ level 8', 8, 'mini'),
('C++ Mini Game 9', 'Mini game for C++ level 9', 9, 'mini'),
('C++ Mini Game 10', 'Mini game for C++ level 10', 10, 'mini');



-- Link each mini-game to the corresponding task so completing a quest unlocks the mini-game
INSERT INTO game_tasks (game_id, task_id)
SELECT g.id, t.id
FROM games g
JOIN tasks t ON g.level_number = t.level_number
WHERE (g.title LIKE 'Python Mini Game%' AND t.language = 'python')
   OR (g.title LIKE 'Java Mini Game%' AND t.language = 'java')
   OR (g.title LIKE 'C++ Mini Game%' AND t.language = 'cpp');

-- Also add a few curated global games (kept for variety)
INSERT INTO games (title, description, level_number, game_type) VALUES
('Code Quest Adventure', 'Embark on an adventure where you solve coding challenges to progress through levels!', 1, 'adventure'),
('Syntax Master', 'Test your knowledge of programming syntax and win rewards!', 2, 'quiz'),
('Algorithm Race', 'Race against time to solve algorithmic challenges!', 3, 'racing');

-- Seed minimal learning content for the three supported languages
INSERT INTO learning_content (language, topic, title, content, code_examples, order_index) VALUES
-- Python Content
('python', 'basics', 'Python: Getting Started', 'Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum in 1991, Python has become one of the most popular programming languages worldwide. It is used for web development, data science, artificial intelligence, scientific computing, and many other applications.', '# Your first Python program\nprint("Hello, World!")', 1),
('python', 'variables', 'Python: Variables and Types', 'Variables are containers for storing data values. Python has several built-in data types: integers (int), floating-point numbers (float), strings (str), booleans (bool), lists, tuples, dictionaries, and sets. Unlike many other languages, Python is dynamically typed, meaning you don''t need to explicitly declare variable types.', 'a = 10  # integer\nb = 3.14  # float\nname = "Python"  # string\nis_fun = True  # boolean\nprint(a, b, name, is_fun)', 2),
('python', 'conditionals', 'Python: Conditionals and Control Flow', 'Conditional statements allow your program to make decisions. The if, elif, and else statements control the flow of execution based on boolean conditions. You can use comparison operators (==, !=, <, >, <=, >=) and logical operators (and, or, not) to create complex conditions.', '# Check if a number is positive\nnum = 5\nif num > 0:\n    print("Positive")\nelif num < 0:\n    print("Negative")\nelse:\n    print("Zero")', 3),
('python', 'loops', 'Python: Loops and Iteration', 'Loops are used to execute a block of code multiple times. Python provides two types of loops: for loops (iterate over a sequence) and while loops (execute while a condition is true). You can use break to exit a loop early or continue to skip the current iteration.', '# For loop example\nfor i in range(1, 6):\n    print(f"Iteration {i}")\n\n# While loop example\ncount = 0\nwhile count < 3:\n    print(f"Count: {count}")\n    count += 1', 4),
('python', 'functions', 'Python: Functions and Modular Code', 'Functions are reusable blocks of code that perform specific tasks. Define functions using the def keyword. Functions can accept parameters (inputs) and return values (outputs). Using functions makes your code more organized, maintainable, and easier to test. Functions can have default parameters and variable-length arguments.', '# Define and use a function\ndef greet(name="Guest"):\n    return f"Hello, {name}!"\n\nprint(greet("Alice"))\nprint(greet())  # Uses default parameter', 5),
('python', 'data_structures', 'Python: Lists and Collections', 'Lists are ordered collections that can hold multiple values of different types. Other important data structures include tuples (immutable sequences), dictionaries (key-value pairs), and sets (unordered unique elements). Each has different use cases and performance characteristics. You can create, access, modify, and iterate over these collections efficiently.', '# Working with lists\nnumbers = [1, 2, 3, 4, 5]\nnumbers.append(6)\nnumbers.remove(3)\nprint(numbers)\n\n# Working with dictionaries\nperson = {"name": "Alice", "age": 30}\nprint(person["name"])', 6),
('python', 'strings', 'Python: String Manipulation', 'Strings are sequences of characters enclosed in quotes. Python provides powerful string methods for manipulation: upper(), lower(), replace(), split(), join(), find(), etc. You can also use string formatting with f-strings (f"text {variable}") or the format() method. String slicing allows you to extract portions of a string using index notation.', '# String operations\ntext = "Python Programming"\nprint(text.lower())\nprint(text.replace("Python", "Java"))\n\n# String formatting\nname = "Alice"\nage = 25\nprint(f"{name} is {age} years old")', 7),
('python', 'file_io', 'Python: File Input and Output', 'File I/O allows you to read from and write to files. Use the open() function with modes: "r" (read), "w" (write), "a" (append). Always use context managers (with statement) to ensure files are properly closed. You can read entire files, read line by line, or read specific amounts of data. Writing to files allows you to persist data beyond program execution.', '# Reading and writing files\n# Writing to a file\nwith open("example.txt", "w") as f:\n    f.write("Hello, World!")\n\n# Reading from a file\nwith open("example.txt", "r") as f:\n    content = f.read()\n    print(content)', 8),
('python', 'oop', 'Python: Object-Oriented Programming', 'Object-Oriented Programming (OOP) is a programming paradigm based on objects and classes. Classes are blueprints for creating objects with attributes (data) and methods (functions). Key concepts include encapsulation, inheritance, and polymorphism. Python allows you to create class hierarchies, override methods, and leverage code reuse through inheritance.', '# Define a class\nclass Dog:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def bark(self):\n        return f"{self.name} says Woof!"\n\n# Create an instance\ndog = Dog("Buddy", 5)\nprint(dog.bark())', 9),
('python', 'error_handling', 'Python: Error Handling and Debugging', 'Error handling is crucial for writing robust programs. Use try-except blocks to catch and handle exceptions. The finally block executes regardless of whether an exception occurred. Different exception types (ValueError, TypeError, FileNotFoundError, etc.) can be caught separately. Logging and debugging tools help you identify and fix issues in your code.', '# Error handling example\ntry:\n    num = int("abc")  # This will raise ValueError\nexcept ValueError:\n    print("Invalid number format")\nexcept Exception as e:\n    print(f"An error occurred: {e}")\nfinally:\n    print("Cleanup code here")', 10),

-- Java Content
('java', 'basics', 'Java: Getting Started', 'Java is a popular, object-oriented programming language known for its "write once, run anywhere" philosophy. It uses a virtual machine (JVM) to execute bytecode, making programs portable across different platforms. Java is used in enterprise applications, Android development, and large-scale systems. Its strong type system and garbage collection make it reliable and easy to maintain.', 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}', 1),
('java', 'variables', 'Java: Variables and Data Types', 'Variables in Java must be explicitly typed. Java has 8 primitive data types: byte, short, int, long, float, double, boolean, and char. Additionally, there are reference types like String, Arrays, and Objects. Each type has a specific range of values and memory footprint. Type safety ensures compile-time error detection for type mismatches.', 'int count = 10;  // Integer\ndouble price = 19.99;  // Decimal\nString name = "Alice";  // String\nboolean isActive = true;  // Boolean\nSystem.out.println(count + " " + price + " " + name);', 2),
('java', 'conditionals', 'Java: Conditional Statements', 'Conditional statements (if, else if, else) control program flow based on conditions. Java also supports the switch statement for selecting one of many options. The ternary operator (? :) provides a compact way to choose between two values. Proper use of conditionals makes your program logic clear and maintainable.', 'int score = 85;\nif (score >= 90) {\n    System.out.println("A");\n} else if (score >= 80) {\n    System.out.println("B");\n} else {\n    System.out.println("C");\n}', 3),
('java', 'loops', 'Java: For and While Loops', 'Loops execute code repeatedly. The for loop is ideal for iterating a known number of times, while the while loop continues until a condition becomes false. The enhanced for loop (for-each) simplifies iteration over collections. Use break to exit early or continue to skip to the next iteration. Nested loops enable complex iteration patterns.', '// Traditional for loop\nfor (int i = 1; i <= 5; i++) {\n    System.out.println("i: " + i);\n}\n\n// Enhanced for loop\nint[] numbers = {1, 2, 3, 4, 5};\nfor (int num : numbers) {\n    System.out.println(num);\n}', 4),
('java', 'methods', 'Java: Methods and Functions', 'Methods are reusable blocks of code that perform specific tasks. Each method must have a return type, name, and parameters. Methods promote code reuse, organization, and easier maintenance. Java supports method overloading (same name, different parameters) and the concept of return types prevents unexpected data types from being returned.', 'public class Calculator {\n    public static int add(int a, int b) {\n        return a + b;\n    }\n    \n    public static void main(String[] args) {\n        int result = add(5, 3);\n        System.out.println("Sum: " + result);\n    }\n}', 5),
('java', 'arrays', 'Java: Arrays and Collections', 'Arrays store multiple values of the same type in a single variable. Arrays are fixed-size and zero-indexed. Java also provides Collections framework with flexible data structures like ArrayList, HashSet, and HashMap. These collections can grow dynamically and offer rich APIs for manipulation, searching, and sorting.', 'int[] numbers = {1, 2, 3, 4, 5};\nfor (int i = 0; i < numbers.length; i++) {\n    System.out.println(numbers[i]);\n}\n\nArrayList<String> fruits = new ArrayList<>();\nfruits.add("Apple");\nfruits.add("Banana");\nSystem.out.println(fruits);', 6),
('java', 'strings', 'Java: String Operations', 'Strings are immutable objects in Java. The String class provides methods like length(), charAt(), substring(), toUpperCase(), toLowerCase(), replace(), split(), and indexOf(). The StringBuilder class offers mutable string operations for better performance when doing many string concatenations. String comparison should use equals() or equalsIgnoreCase() instead of ==.', 'String text = "Java Programming";\nSystem.out.println(text.length());\nSystem.out.println(text.toUpperCase());\nSystem.out.println(text.substring(0, 4));\n\nString replaced = text.replace("Java", "Python");\nSystem.out.println(replaced);', 7),
('java', 'oop', 'Java: Classes and Objects', 'Object-Oriented Programming is fundamental to Java. Classes define blueprints for objects with attributes (variables) and methods. Constructors initialize objects. Encapsulation hides internal details. Inheritance allows code reuse through class hierarchies. Polymorphism enables flexible and extensible code. Access modifiers (private, protected, public) control visibility.', 'public class Car {\n    private String color;\n    private int year;\n    \n    public Car(String color, int year) {\n        this.color = color;\n        this.year = year;\n    }\n    \n    public void drive() {\n        System.out.println("Driving a " + color + " car");\n    }\n}', 8),
('java', 'exception_handling', 'Java: Exception Handling', 'Exception handling makes programs robust by gracefully handling errors. Use try-catch blocks to handle specific exceptions. The finally block always executes. Checked exceptions must be caught or declared with throws. Unchecked exceptions (RuntimeException subclasses) are optional to handle. Proper exception handling improves code quality and user experience.', 'try {\n    int result = 10 / 0;  // ArithmeticException\n} catch (ArithmeticException e) {\n    System.out.println("Cannot divide by zero");\n} finally {\n    System.out.println("Cleanup done");\n}', 9),
('java', 'file_operations', 'Java: File Input and Output', 'Java provides multiple ways to perform file I/O. Use FileWriter/FileReader for character-based I/O. Use FileInputStream/FileOutputStream for byte-based I/O. The Scanner class simplifies reading input. BufferedReader/BufferedWriter improve performance. Always close resources using try-with-resources for proper resource management and to prevent memory leaks.', 'try (FileWriter writer = new FileWriter("output.txt")) {\n    writer.write("Hello, File!");\n} catch (IOException e) {\n    System.out.println("File error: " + e.getMessage());\n}', 10),

-- C++ Content
('cpp', 'basics', 'C++: Getting Started', 'C++ is a powerful, general-purpose programming language that combines low-level memory manipulation with high-level abstractions. It supports both procedural and object-oriented programming. C++ is known for its efficiency and is widely used in system software, game engines, embedded systems, and performance-critical applications. Its standard library (STL) provides extensive functionality.', '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}', 1),
('cpp', 'variables', 'C++: Variables and Data Types', 'C++ supports multiple data types: int, float, double, char, bool, and their variants. Variables must be explicitly typed. C++ allows variable scope control with local, global, and static variables. The const keyword creates constants. Pointers and references are fundamental to C++, allowing advanced memory management and efficient parameter passing. Type casting explicitly converts between types.', 'int age = 25;\nfloat price = 19.99f;\nchar grade = ''A'';\nbool isValid = true;\n\nint* ptr = &age;  // Pointer to int\nstd::cout << "Value: " << *ptr << std::endl;', 2),
('cpp', 'conditionals', 'C++: Decision Making', 'C++ provides if, else if, else, and switch statements for conditional execution. The ternary operator (? :) selects between two values. Proper use of conditions makes code logic clear. Switch statements are efficient for multiple conditions on a single value. Comparison operators (==, !=, <, >, <=, >=) and logical operators (&&, ||, !) build complex conditions.', 'int score = 85;\nif (score >= 90) {\n    cout << "Grade: A" << endl;\n} else if (score >= 80) {\n    cout << "Grade: B" << endl;\n} else {\n    cout << "Grade: C" << endl;\n}', 3),
('cpp', 'loops', 'C++: Loops and Iteration', 'C++ provides for, while, and do-while loops. The for loop is ideal for counted iterations. The while loop continues until a condition is false. The do-while loop executes at least once before checking the condition. The range-based for loop (C++11) simplifies iteration over containers. Break and continue modify loop flow. Nested loops enable complex iteration patterns.', '// For loop\nfor (int i = 1; i <= 5; i++) {\n    cout << i << \" \";\n}\n\n// While loop\nint count = 0;\nwhile (count < 3) {\n    cout << count << \" \";\n    count++;\n}', 4),
('cpp', 'functions', 'C++: Functions', 'Functions are reusable code blocks that perform specific tasks. Each function has a return type, name, and parameters. Function overloading allows multiple functions with the same name but different signatures. Default parameters provide flexibility. Inline functions optimize small, frequently-called functions. Recursion enables elegant solutions for certain problems.', 'int add(int a, int b) {\n    return a + b;\n}\n\nint multiply(int a, int b) {\n    return a * b;\n}\n\nint main() {\n    cout << add(5, 3) << endl;\n    cout << multiply(5, 3) << endl;\n    return 0;\n}', 5),
('cpp', 'arrays', 'C++: Arrays and Vectors', 'C++ arrays are fixed-size collections of elements with the same type. Arrays are zero-indexed. The vector class from the STL is more flexible and dynamically resizable. Vectors support push_back(), pop_back(), size(), and iteration. Multi-dimensional arrays and vectors handle complex data structures. Understanding array decay (array-to-pointer conversion) is important for C++ mastery.', 'int arr[5] = {1, 2, 3, 4, 5};\nfor (int i = 0; i < 5; i++) {\n    cout << arr[i] << \" \";\n}\n\nvector<int> vec = {1, 2, 3};\nvec.push_back(4);\nfor (int num : vec) {\n    cout << num << \" \";\n}', 6),
('cpp', 'pointers', 'C++: Pointers and References', 'Pointers store memory addresses and are central to C++. The address-of operator (&) gets an address; the dereference operator (*) accesses the value. References are aliases to variables and cannot be null. Pointer arithmetic enables iteration and manipulation of arrays. Smart pointers (unique_ptr, shared_ptr) manage memory automatically, reducing memory leaks.', 'int x = 10;\nint* ptr = &x;  // Pointer to x\nint& ref = x;   // Reference to x\n\ncout << "x: " << x << endl;\ncout << "*ptr: " << *ptr << endl;\ncout << "ref: " << ref << endl;\n\nref = 20;  // Modifies x\ncout << "x after: " << x << endl;', 7),
('cpp', 'oop', 'C++: Classes and Objects', 'C++ is object-oriented. Classes define blueprints with data members and member functions. Constructors initialize objects; destructors clean up. Access specifiers (public, private, protected) control visibility. Inheritance allows code reuse. Virtual functions enable polymorphism. Static members are shared across instances. Understanding the object lifecycle is crucial.', 'class Dog {\nprivate:\n    string name;\npublic:\n    Dog(string n) : name(n) {}\n    void bark() {\n        cout << name << " says Woof!" << endl;\n    }\n};\n\nDog dog("Buddy");\ndog.bark();', 8),
('cpp', 'stl', 'C++: Standard Template Library (STL)', 'The STL is a powerful collection of template classes and functions. It includes containers (vector, list, deque, set, map), iterators (pointers to elements), and algorithms (sort, find, transform). Templates enable generic programming. STL promotes code reuse and efficiency. Understanding STL is essential for modern C++ programming and competitive coding.', '#include <algorithm>\nvector<int> v = {3, 1, 4, 1, 5, 9};\nsort(v.begin(), v.end());\nfor (int num : v) {\n    cout << num << \" \";\n}\n\nauto it = find(v.begin(), v.end(), 4);\nif (it != v.end()) {\n    cout << "Found!" << endl;\n}', 9),
('cpp', 'exception_handling', 'C++: Exception Handling', 'C++ provides try-catch blocks for exception handling. Throw statements raise exceptions. Exception types can be standard (bad_alloc, runtime_error) or custom. The catch block parameter filters exceptions by type. Multiple catch blocks handle different exceptions. Stack unwinding ensures proper cleanup. Exception specifications (optional) document expected exceptions.', 'try {\n    int result = 10 / 0;\n} catch (runtime_error& e) {\n    cout << "Error: " << e.what() << endl;\n} catch (...) {\n    cout << "Unknown error!" << endl;\n}', 10);




