/*
* This script makes some modifications to the relations.ts file specific to our codebase
* It should be ran each time after doing 'npx drizzle-kit pull' 
*/

using System.IO;

namespace drizzle_fix
{
    internal class Program
    {
        static bool FileHas(string path, string text)
        {
            using var reader = new StreamReader(path);

            string? line;
            while ((line = reader.ReadLine()) != null)
            {
                if (line.Contains(text))
                {
                    return true;
                }
            }

            return false;
        }

        static void Main(string[] args)
        {
            string[] files = Directory.GetFiles(".");

            foreach (string path in files)
            {
                string name = Path.GetFileName(path);
                if (name == "relations.ts")
                {
                    Console.WriteLine("Found a relations.ts file in the current directory.\n");
                    Console.WriteLine("Modifying 'relations.ts'...\n");

                    bool addCorrectChoices = !FileHas(path, "correctChoices: many(questionChoices)");

                    string tempPath = "./temp.ts";
                    {
                        using var reader = new StreamReader(path);
                        using var writer = new StreamWriter(tempPath);

                        string? line;
                        while ((line = reader.ReadLine()) != null)
                        {
                            if (line.Contains("./schema") && !line.Contains("./schema.ts"))
                            {
                                int i = line.IndexOf("./schema");
                                i += "./schema".Length;

                                line = line.Insert(i, ".ts");

                                Console.WriteLine($"- Added .ts to schema file name, '{line}'\n");
                            }

                            if (addCorrectChoices && line.Contains("questionChoices: many(questionChoices)"))
                            {
                                writer.WriteLine(line);
                                writer.WriteLine("  correctChoices: many(questionChoices),");

                                Console.WriteLine($"- Added 'correctChoices' name for questionChoices relation, '{line}'\n");
                                continue;
                            }

                            writer.WriteLine(line);
                        }
                    }

                    File.Delete(path);
                    File.Move(tempPath, path);
                    Console.WriteLine("Modifications done! If none were logged, then none were needed.");
                    return;
                }
            }

            Console.WriteLine("Couldn't find a relations.ts file in the current directory..");
        }
    }
}
