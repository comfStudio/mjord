DO $$
DECLARE
    table_rec RECORD;
BEGIN
    FOR table_rec IN (
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_catalog = current_database()
    ) LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || table_rec.table_name || ' CASCADE';
    END LOOP;
END $$;