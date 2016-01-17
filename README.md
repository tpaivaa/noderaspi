# noderaspi
Sync Soittila Temperatures to Azure table
and local MariaDB

```
MariaDB [lampotilat]> select * from lampotilat;
+------+---------------------+---------------+---------+
| tKey | time                | sensor        | celsius |
+------+---------------------+---------------+---------+
|    3 | 2016-01-18 00:36:48 | ulkoE         |  -17.06 |
|    4 | 2016-01-18 00:36:59 | varaajaMiddle |   55.06 |
|    5 | 2016-01-18 00:27:57 | greeWaterCold |   27.13 |
|    6 | 2016-01-18 00:36:48 | greeGasCold   |   22.88 |
|    7 | 2016-01-18 00:37:02 | khh           |   22.63 |
|    8 | 2016-01-18 00:36:58 | khhLattia     |   35.25 |
|    9 | 2016-01-18 00:36:50 | keittio       |   23.25 |
|   10 | 2016-01-18 00:36:52 | keittioLattia |   29.75 |
|   11 | 2016-01-18 00:37:00 | olohuone      |   20.44 |
|   12 | 2016-01-18 00:36:54 | makuuhuone    |   22.63 |
|   13 | 2016-01-18 00:27:54 | ykAula        |   15.13 |
|   14 | 2016-01-18 00:23:02 | verantaLattia |   40.31 |
|   15 | 2016-01-18 00:36:57 | veranta       |   20.50 |
|   16 | 2016-01-18 00:27:56 | ykMH          |   16.56 |
+------+---------------------+---------------+---------+
```
