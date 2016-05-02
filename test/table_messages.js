"use strict";

// initialize database
var path = require('path');
var assert = require('assert');
var initDB = require('../db/init_db');
var db = null;
var db_path = path.join(__dirname, '../db/table_messages.db');

// table_messages
describe('table_messages', function () {
    before(function () {
        // console.log(initDB);
        db = initDB.createDB(db_path);
    });

    after(function () {
        initDB.cleanDB(db_path);
    });

    it('should be able to save messages', function (done) {
        var sample_data = {
            "NAME": 'test',
            "MESSAGE": "Hello World",
            "Timestamp": "02/28/2016 23:19:30 PM"
        };

        db.messages.saveMessage(db,
            function (row_id, error) {
                assert.equal(null, error);
                assert.equal(true, row_id);
                done();
            },
            sample_data);
    });

    it('should be able to save pictures', function (done) {
        var sample_data = {
            "NAME": 'testpic',
            "MESSAGE": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAArCAYAAAA9iMeyAAAQCklEQVR4Xu2dfVzO9/7Hn3VFhDo6GxZnM0eYm+2wpMiK0ITiIuaaTDJDFic3S0q6Wc2Ou+WmHHcxpVJEs1inpsYcw8ZMTIbZbHOT/bK5L/0e3+vq5urq+63rSm7qfL9/1uf7/n4+r8/7/bn7Pr/vywgo5hFeHZ1UuNg8w738a3y1cStfP+TjnJQqrLhE/Pbsh671KN8AerY248qpDJbEauyNmuJLg9wotuboZ17v8g0cUQ6D7TWst61SRev8w+zIzquyYnrXR7/mPXQpob+a377EjvSH76+HrkwNDBg16uVbHLdwGOamZphxi1tFBaTOG82qIw9qYK7yLZ1HzmaSU1d62b/Ef2bZE5xdc7uhcRk4WubzW6EVz/yZifPYEPUDG9l6seF9H6yubcdpbIRe9X5vUwauFhfI+uoyJndzCVoSDwoblqcEU5gawuzYI9XbMaC8xdBFbPO+z6ARgdXbFSkRtvMQ3b5dyPCgdOn7DaiPlJFGvWaTGuVBs8JCTRETU+6f09K1gSPx+5ag+CSIMZHpNOoVQPoqJQ1v3aIIUChukjLPldV33yUufDDFly9T1PR5Xmj2C5EDxrOzuOb9XyPhHvImo9IZxGH+FqYp1qIKfQSRrrAhKWcppwKcahwgXb3XEjPmDg6D3lU3eXXGAUyTZ+BzzInkSAe+Sj9H9x4FjCgJmip1aTiYpIx3SHFSkviYOsx8SDhbJtzHzUMT1IZe/ok59DwZycjQKgLEUKN6lPePy+Dl75aiitQ812dlGl52z3EmJUj9t6b9g/k09CXmO4zlC6nVgbE1Ww/Gcj64LwF76miAuC1M4A1FEqqg7Woh3ouOpfnl2/Qd2oWDH++hg0qJ4tA6lv1kh6/1Gfbf68FIu7bc+SmHf46YpV46NR8ZQKzP6zSnEExNOJUQxDsrskFwyM/nVQoQyfIiHeefmIX9+ZW4+2vqN+bDVKb+7auyGaNp/3Dip1bvgCYdHPHxcGegszXffZrNjYZwdNtisi19SYwcxTMmBaQEurE0R7PybNI/gJhRcPRuDzx6t6U4/zDzXKdxuNe7ouXVTrQsAZWtFXfvguLOSQJdp3F8SBib3oDsa50q2BGcym7iIsIm2GOqUHDtaCJK3yjNs/vNZnOQG89SiKm5OT+UOKWYXzfqZVj9JZ1Zy3gL7xVsGwneru9yFmg+ainJ4xtz6I+OtP/+X4wO1QTI3kU2bJodQlb2EXU53Uvom08jurLKXknb1RtE/WqIb4yoblXp06CTF5tWeNFGIfgbnEgIwUfwt1q8ymYQ3QBZkJjDQONMog5b857ShFUrf8TD/T7LjrUlckQnzmWvY/TcI/w7YxVNds9lXEw70rK8OB3tp16ehO08QOej4ZoRTyRAjJp4SZcXaeCClBxeOV4+gg4MTCb41RM4jNCMyPqO0CYdlUTMVNK9S0t+Pn6aOyb3yV46i4Q8TUBEJqdRvM69bKQTAmTPh0qufrlZ7birM3J4EOfN9FjNXkC3fIOXfPls8zA22rqwufgBJtbWFOblqQPtkw+V/F5m5wCmu2YwaUM30rI8yRw3kGU/tGP9f9ZzfYUTc9OHk5I5i183B+CzJpvQlBy6aLVfygcMrb+UHaNGSlIyp/LFDBeWCcttYWmVGUyu9yAKw7PKZrPSwGwuLNFNi8jd9RHjQ+PLzBqZqdj5uQ/nlnsxc+sZpPzKfcEVUd00flJZnzmf9GXD3g8xyVjIeGF2U9jwWvcCco5UvUczNHYkAyQ0OR3zuCEkd45nTstdjIm3JmkWrDjejbDXLmI3yE/9rFLHXaN4h5CXv8G+xGErOLRIgAwKSZUuL9IKXQepaYCoTTdwJG7n28S4elZaFoQmpFEc605wyVJAGCF3+Ldi6qCp6tFRaNc/ciNRluwFdMtjbM3i7etxtLxO5s4k/IW9DahHWjE7S/54k4/cLTh4KI/7QNter2GcFcSqu28RZnsWOzfNnkV3gJDqaEPrL2XHPy4L23MrUZasKKbHpDPMNBMXr8VEpubQ8XQMyoDD8KDcITuPCmaN/zCOLlGpg0HQef3eCIx2BzBxiWZkl/IrtzHxorr1mbtFVJ9xn/dhb0R7/O2qWNoZGg0i5aUDRHCUaHf294vH60E0Ez9zKguQBa+coG/JWnpBygH+kRtObJE3Pi/k4OKlWR58kHYA68PSM4jbwmTp8iIVnb4ug4EFG3GfpXG4N5al4dVkNy6TY7RmEHDz0GMT3HAwcalvkjSk8qZR18HUM9O4+7iV7G10HbVSgJTUfdSMcDzdB2KlOM9iJxXprqGidmIeeBPW+yprth2nWTO4d+8uFw5vpGhYMgu6lOtcYUauouMNrb+YqdJ9xft9VewV9mgNHFm1LZAOpoXC4pkmls9ievcGBfknCRvhW2GQEfyhR264+jAhNDGLrufXofQvn1HU9RPxq9K9ma5u1+cnieqz3yL88QaI7ia9QkMU0UzcrR0gX9PXIwJhOZG+cTA7PIdw5s0kwnqcVo94A+as5YMx3cs2cqVLrG9n9CP8iHDWAQMXJkuXF+m15h4rSJtigoPzVPV/hU26cfIEpqzRjGCN7IJJmiE4sh6nWFUGSCr3Fo8sq6fu0q1ygFQsL8wg7R/kla3F/52VQ8EKJ8LuhVbYpJfaeXNvF9I/cmC5vbLshMfGxprmr0cS1vsH7Fzfw37qCpZ721e5BymVLDTBsPqLBYjQNwu6aPpY7BIODLof82NMpM5Jn7BS+GIhV6LH4X9Rxa75bejv/HYFE1J+JcwgYroF/eInqs/R3J7szJnBxZXjypa7tTBhVDKhOeYNH4a5wgwzk1vcuqs55m05ezvF0Uoy+m1Wn26VBoiwJ/lg9Itc/fUGTVo04cSWIPXGSNgwJa73oXXRLQouHeG4UTdeyF2q3shp1q9LeP7u7/zx52kiRvjy304TpMtLtFQYkRzNrnChqAVt7n+Js0cgwhpYqL8ZpliaFXL9VhF/5qXhMU0zk4leVQSIcGoz4m8KLh5LxcM3qtLeRnDsrscjNe0CdMurj0mXulF89Qo3FRa0Mr3Ev1wm8rkwg2idYmnb8Xw/gelOf+WnXwuwaGHJmW0hTF/7V+I+C+Dv3KLg8klyjTpi9a1mY1zVZWj9RQMkMJnAV0/gWLJc1i2jXXdhb7Uz8nVu/3qdxs+2oehMgnoZNmDuFrWf3LhRhIkJKEzhu6QgLvf8p6hfjV58U1Q34VhYTB/B57qMW8TKmU4UXr2CwtyCC9uDypZytRUsZUssfQ1q1v6n8Zq7ieK88pFSfb+xNa/3tWBPth7vEGpSHhDWuVEzu7O27+M7otVXG+1yToOVNCdf7xdkwumaW1czvt2eXn4SZGyN0yAL9u3RU8+aVLQW7ulg44hNt3bcPre/2heZ1T1OSjdRfUp8aLBLe25ePVvrG3TBvMEBImyuQ7t/g51bzc7zqxNIn//beS8lYmIv7lw8ROBYzRGzfMkKPAoFDA4QE2sbelvU/nGawY0ztsaxrwXZ+s5WBj9AvkFWoAYziCyarMD/kgIGzyD/S+LIbZUVeOQB8rho3ppQozLNKx0AhurpqvLC4vcTbE0vP1BQb947tOb2peop5Kc1FOs8zas55jWcGpVpXnGXlNJzr62/KLUbdWUsG1ZM4i/5v2Bs9SJFxz7G3TcG4bg7MdyRPy7l0+x5axpf2s0gT817lZrQ108qgOo8zeu9RusIVF9qVKZ59fM3LT0j7gWJUrtvLUtDZbodl2kbEfitT/bP5KCfE+E55dSu8V/mkJ3Rh3BbJdm2fobT1/rV9pGUkkRN6hrNK6ijTY1KYewyzauhkfWhebX13N0vSJTaFRCYDv8NYExkthoY3PplDA13B1XA8p1nxhLiehvfQdPKjuR16Wspf3vSlG+9oXl1qVGp4USmeSvSyFI66eopRe0KjNzwB2kMmBylfrMdM9OZn0qw/N4zogkf3QNz00J2B/YtA0CFZ1ZCeCTo8SdN+dYPmleEGq1yvpVp3jIaWVSnavSsQO0mP8eabcG8ZA53Cr7n8OXnePHqGlRaXz72n7iIkKkvs1k1hLV5mqWXboA8rZRvvaB5xajRKgNEpnmr/DJRHz21qV1trecJnwMcET7HrfjhUin1XfqZgCZAyunrp5Xyldyk1xWad3aeODVa8wAxjIbVpWfrOs0roO5iFG4FPbWo3dIPx4T/l9Ldib2HsvaBhtpWX8bWbN4Xy/VozUdT6pMsHfr6aaV86zzNK0WNvlPygY5ooMg0ryQVLKWn3zd9RKld4bPg+ABHfr9QQJvOz/N9gobuHjAnlpDhLTmfd5lmrdvR4LdMfD1D+FmCvj5l2f+ppHwNflEo07z6nSbWR5pXitq1HayixwvmnM+MYa/WF68dnZT07tSC/zuVWWcpX4MDRKZ59QsQuVT9UMDgAJFp3vrR8XIr9FPA4ADRz6xcSlagfiggB0j96Ee5FY9IgUceII+D5q0pNSrTvNJeJUXzGpobWcqOgPyM7tOa6ycOs6eWc1nVZqzUA5pXmhqtSiiZ5hVXpyo6OigugwHm+VwzsaLZtUwGeWp9dl0pZ680Ze08I5rg0e25mHeJpi2bkhPpUZbJsjaduzZs1SuaV5saVedzkrpkmlc/39GieeNbr2HdeBjn+DY/mKnIyPHj7MqxTCnJMKmbs7fCA7TsBP84mbR17qRMKMdO9KvMkylVr2heMWpUV1aZ5q0Zzftiwj7szy9X50b2W5fG0HaWPLi0gwGei0Vz9mrrrk0FC4nggl/9GocREXSwseZMyfJKpnl1klfXZm7eqqjRSgEi5+atkFtYalyulFNXnRvZj7cOeLBrVgOWftYCf8c8HEbvE83ZW2pX147bwi14tb7CjVbdsGpkSuPic+q8Ya8k7BPNBS3TvGK5fEV6rbrcvMItYtSoqAPINK/BNK+QLK7jwRiuOU/i5kcDSHw5nlX2p0i4bCeds1eECh4YmEDkcCtSAx0J31PMWyvT8bLIJKexs2gu6Ceds7de0LzaQaBLjYoGiEzzGkzz+m1KZ7iVKX/+/CmuXovVuZGntDrCycYOkjl7ByZmVsrNK6BKkUPvMNnOU/3xlMP8BD7odZasW688lTl76zzNW5qbVx0IItSo4QEi07xiNO8z46LZM7MjUT0HsNno73z8xRZurh1XtkkXdNbO2StFBQu/SJWx0p6Vtu7qHy+aHJOO+82POdp6bHmAaOWCftI5e+s+zStBjYr9kEtZsMg0r8E0r0BHC8e8LpYF/FjYglZaP4FXqqt2zt6qKOu3l6Uy6VUFeb/A85YFrPbxpHPYDpnmrTSaG5rLVyI3b21So7V1mFgfaV5Bm34qLzrwG2viH+6n4GyVXvSwKCBmo+YXw6q7nlTOXoPfpMs0b3VdKf+/PilgcIDING996n65LdUpYHCAVGdQ/r+sQH1SQA6Q+tSbcltqXQGDA6S26dzSFtkqVbTOL8/hOmqKLw1yo9iaU+ttlg3KCuitwP8DU105D1QcX7QAAAAASUVORK5CYII=",
            "Timestamp": "03/28/2016 10:18:30 PM"
        };

        db.messages.saveMessage(db,
            function (row_id, error) {
                assert.equal(null, error);
                assert.equal(true, row_id);
                done();
            },
            sample_data);
    });


    it('should be able to get messages', function (done) {
        db.messages.getMessages(db, function (rows, error) {
            assert.equal(error, null);
            assert.equal(rows[0].USERNAME, "test");
            assert.equal(rows[0].MESSAGE, "Hello World");
            assert.equal(rows[0].Timestamp, "02/28/2016 23:19:30 PM");
            done();
        });
    });
});