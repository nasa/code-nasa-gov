
var currentTag = "";
function CodeCtrl($scope, $http, $location, $window, $sce, $timeout) {
  $scope.isLoading = true;

  if($scope.catalog) {
    CodeCtrlImpl($scope, $http, $location, $window, $sce, $timeout);
    $scope.isLoading = false;
  }
  else {
    $http.get("/data/catalog.json", {})
      .success(function(result, status, headers, config) {
        for(var i=0; i<result.length; i++) {
          result[i].tagFilter = true;
          var repourl = result[i]["Public Code Repo"];
          result[i]["repourl"] = result[i]["Public Code Repo"];
          var parts = repourl.split('/');
          var host = parts[2];
          if(host == "github.com") {
            result[i].protocol = parts[0];
            result[i].host = host;
            result[i].user = parts[3];
            result[i].repo = parts[4];
          }
        }
        $scope.catalog = result;
        CodeCtrlImpl($scope, $http, $location, $window, $sce, $timeout);
        $scope.isLoading = false;
      })
      .error(function(serviceData, status, headers, config) {
        console.log("error occured pulling catalog data in get ajax call.");
      });
  }

} //end CodeCtrl

function CodeCtrlImpl($scope, $http, $location, $window, $sce, $timeout) {
  $scope.maxTags = 10;
  $scope.maxTagLength = 24;

  $scope.clearSearch = function() {
    $scope.search = "";
  }

  var queryString = $location.search();
  var clear = queryString.clear;
  if(!jQuery.isEmptyObject(clear)){
    showAll();
    if(!$scope.$$phase) {
      $scope.$apply();
    }
    return;
  }

  if(currentTag) {
    applyTagFilter(currentTag);
  }
  else {
    $scope.displayInfoString = "Showing " + $scope.catalog.length + " NASA Open Source Software Projects";
  }

  function showAll() {
    for(var i=0; i<$scope.catalog.length; i++) {
      var catalogItem = $scope.catalog[i];
      catalogItem.tagFilter = true;
    }
    $scope.isTagfiltering = false;
    currentTag = "";
  }
  $scope.showAll = function() {
    showAll();
  }

  function applyTagFilter(tag) {
    currentTag = tag;
    var numTagged = 0;
    for(var i=0; i<$scope.catalog.length; i++) {
      var catalogItem = $scope.catalog[i];
      catalogItem.tagFilter = true;
      var found = false;
      for(j=0;j<catalogItem.Categories.length; j++) {
        if(catalogItem.Categories[j] == tag) {
          found = true;
          numTagged++;
          break;
        }
      }
      if(!found) $scope.catalog[i].tagFilter = false;
    }
    $scope.isTagfiltering = true;
    $scope.numTagged = numTagged;
    $scope.currentTag = currentTag = tag;
  }

  $scope.applyTagFilter = function(tag) {
    applyTagFilter(tag);
  }

  $scope.details = function(project) {
    $location.path("/" + project.Software);
  }

  $scope.showAdvSearch = false;
  $scope.advSearch = {
    titles: true,
    descriptions: false
  }
  $scope.getLicenseName = function(abbr) {
    for(var i=0;i<license_content.length;i++) {
      var license = license_content[i];
      if(license["License Short Name"][0] == abbr) {
        return license["License Long Name"];
      }
    }
  }
  $scope.goToLicense = function(abbr) {
    for(var i=0;i<license_content.length;i++) {
      var license = license_content[i];
      if(license["License Short Name"][0] == abbr) {
        return license["License Link"];
      }
    }
  }
}

function GuideCtrl($scope, $http) {
  $http.get("/data/SRA.json", {})
    .success(function(result, status, headers, config) {
      $scope.sras = result;
    })
      .error(function(serviceData, status, headers, config) {
        console.log("error occured pulling sra data");
      });
}

var license_content = [
  {
    "License Short Name":["NASA Open Source"],
    "License Long Name":"NASA Open Source 3.0",
    "License Description":"",
    "License Link":"http://opensource.org/licenses/NASA-1.3"
  },
  {
    "License Short Name":["ALv2"],
    "License Long Name":"Apache License 2.0",
    "License Description":"This free software license includes certain patent termination and indemnification provisions, compatible with GPL3.",
    "License Link":"https://www.apache.org/licenses/LICENSE-2.0"
  },
  {
    "License Short Name":["ASL"],
    "License Long Name":"Apache Software License",
    "License Description":"A whole class of free software licenses, with versions available for individual constraints.",
    "License Link":"https://www.apache.org/licenses/"
  },
  {
    "License Short Name":["BSDv3"],
    "License Long Name":"BSD 3-Clause 'New' or 'Revised' license",
    "License Description":"This permissive, free software license was created by removing the advertising clause from the original version of the BSD license. It is compatible with GNU GPL.",
    "License Link":"http://opensource.org/licenses/BSD-3-Clause"
  },
  {
    "License Short Name":["BSDv2","FreeBSD"],
    "License Long Name":"BSD 2-Clause 'Simplified' or 'FreeBSD' license",
    "License Description":"This is the original BSD license without the advertising (and one other) clause. It is a permissive, non-copyleft-free license.",
    "License Link":"http://opensource.org/licenses/BSD-2-Clause"
  },
  {
    "License Short Name":["BSD"],
    "License Long Name":"Berkeley Source Distribution",
    "License Description":"This permissive, free software license imposes minimal restrictions on the redistribution of covered software.",
    "License Link":"http://en.wikipedia.org/wiki/BSD_licenses"
  },
  {
    "License Short Name":["CC0"],
    "License Long Name":"Creative Commons Public Domain Dedication",
    "License Description":"This free software license dedicates its covered projects to the public domain.",
    "License Link":"https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "License Short Name":["CPL"],
    "License Long Name":"Common Public License",
    "License Description":"This free software license has weak copyleft and choice of law clauses that make it incompatible with the GNU GPL.",
    "License Link":"http://opensource.org/licenses/cpl1.0.php"
  },
  {
    "License Short Name":["CDDL"],
    "License Long Name":"Common Development and Distribution License",
    "License Description":"A free software license scoped copyleft similarly to the Mozilla Public License. It is incompatible with the GNU GPL.",
    "License Link":"http://en.wikipedia.org/wiki/Common_Development_and_Distribution_License"
  },
  {
    "License Short Name":["COTS"],
    "License Long Name":"Commercial off-the-shelf",
    "License Description":"This license is governed by the 3rd-party vendor providing the software. It is neither free nor open source.",
    "License Link":"http://en.wikipedia.org/wiki/Commercial_off-the-shelf"
  },
  {
    "License Short Name":["EPL"],
    "License Long Name":"Eclipse Public License",
    "License Description":"This free software license removes broader patent retaliation language in the Common Public License, but remains incompatible with the GNU GPL.",
    "License Link":"http://www.eclipse.org/legal/epl-v10.html"
  },
  {
    "License Short Name":["GPR"],
    "License Long Name":"Government Purpose Rights",
    "License Description":"Software license allowing free release of the project within the government only.",
    "License Link":"http://www.acq.osd.mil/dpap/dars/dfars/html/current/227_71.htm"
  },
  {
    "License Short Name":["UGPR"],
    "License Long Name":"Unlimited Government Purpose Rights",
    "License Description":"Software license for projects built solely built under government funding that allows for free dissemination of the work.",
    "License Link":"http://www.acq.osd.mil/dpap/dars/dfars/html/current/227_71.htm"
  },
  {
    "License Short Name":["GPLv3", "GPL"],
    "License Long Name":"GNU General Public License (GPL) version 3",
    "License Description":"The latest version of the GNU GPL, this is a free software and copyleft license.",
    "License Link":"http://www.gnu.org/licenses/gpl.html"
  },
  {
    "License Short Name":["GPLv2"],
    "License Long Name":"GNU General Public License (GPL) version 2",
    "License Description":"This free and copyleft software license is an older version of GPL3.",
    "License Link":"http://www.gnu.org/licenses/old-licenses/gpl-2.0.html"
  },
  {
    "License Short Name":["LGPL"],
    "License Long Name":"GNU Library or 'Lesser' General Public License (LGPL)",
    "License Description":"This free software license is not strong copyleft, as it permits linking with nonfree modules.",
    "License Link":"http://www.gnu.org/licenses/lgpl.html"
  },
  {
    "License Short Name":["MIT"],
    "License Long Name":"MIT License",
    "License Description":"The MIT license allows for permissive, free distribution of software and is compatible with GNU GPL.",
    "License Link":"http://en.wikipedia.org/wiki/MIT_License"
  },
  {
    "License Short Name":["MPLv2"],
    "License Long Name":"Mozilla Public License 2.0",
    "License Description":"A free software license with indirect compatibility with GNU GPL v2 and later, but can have constraints that make it incompatible with secondary licenses.",
    "License Link":"http://www.mozilla.org/MPL/2.0/"
  },
  {
    "License Short Name":["NCSA"],
    "License Long Name":"NCSA/University of Illinois Open Source License",
    "License Description":"This license is lax, non-copyleft-free, and based on the terms of the Expat and modified BSD licenses.",
    "License Link":"http://directory.fsf.org/wiki/License:IllinoisNCSA"
  },
  {
    "License Short Name":["NCSLA"],
    "License Long Name":"Non-Commercial Software License Agreement (CU14012)",
    "License Description":"A Columbia University license that allows for free use of this software for non-commercial, academic, or research purposes only.",
    "License Link":"https://secure.nouvant.com/columbia/technology/cu14012/license/258"
  },
  {
    "License Short Name":["Public Domain"],
    "License Long Name":"Public Domain",
    "License Description":"While not technically a license, this designation means the material is not copyrighted.",
    "License Link":"http://directory.fsf.org/wiki/License:PublicDomain"
  },
  {
    "License Short Name":["SUN","SPL"],
    "License Long Name":"Sun Public License",
    "License Description":"Recognized by both the Free Software Foundation and the Open Source Initiative, the Sun Public License is derived from the Mozilla Public License.",
    "License Link":"http://en.wikipedia.org/wiki/Sun_Public_License"
  },
  {
    "License Short Name":["CMUCS"],
    "License Long Name":"Carnegie Mellon University Software Licensing",
    "License Description":"Restricted by a university license that: (a)prohibits further distribution without the new recipient signing the license, (b)prohibits commercialization, and (c)protects the source organization, CMU and USC, from lawsuits.",
    "License Link":"http://www.cs.cmu.edu/~helpext/software_licensing/index.html"
  },
  {
    "License Short Name":["LLVM"],
    "License Long Name":"LLVM Release License",
    "License Description":"Covered by the Illinois/NCSA Academic Use license. This allows individuals to use our software for non-commercial purposes, but restricts commercial use.",
    "License Link":"http://llvm.org/releases/2.8/LICENSE.TXT"
  },
  {
    "License Short Name":["HTK"],
    "License Long Name":"University of Cambridge HTK License",
    "License Description":"Covered by the Illinois/NCSA Academic Use license. This allows individuals to use our software for non-commercial purposes, but restricts commercial use.",
    "License Link":"http://llvm.org/releases/2.8/LICENSE.TXT"
  }
];
